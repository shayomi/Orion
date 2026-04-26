import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploads, startups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { uploadFile } from "@/lib/storage/r2";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/csv",
  "image/png",
  "image/jpeg",
];

/**
 * POST /api/documents/upload
 * Accepts multipart/form-data with a `file` field plus optional metadata.
 * Uploads directly to R2 server-side (no presigned URL / no CORS issues).
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const contentType = req.headers.get("content-type") || "";

  // ─── Multipart upload (file in FormData) ───────────────
  if (contentType.includes("multipart/form-data")) {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const domain = formData.get("domain") as string | null;
    const assessmentId = formData.get("assessmentId") as string | null;
    const questionKey = formData.get("questionKey") as string | null;

    if (!file) {
      return Response.json({ error: "No file provided" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return Response.json(
        { error: `File type not allowed: ${file.type}` },
        { status: 400 }
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return Response.json(
        { error: "File too large (max 10 MB)" },
        { status: 400 }
      );
    }

    // Get or create startup
    let [startup] = await db
      .select()
      .from(startups)
      .where(eq(startups.userId, userId))
      .limit(1);

    if (!startup) {
      [startup] = await db
        .insert(startups)
        .values({ userId, name: "My Startup" })
        .returning();
    }

    const uploadId = crypto.randomUUID();
    const storageKey = assessmentId
      ? `${startup.id}/assessments/${assessmentId}/${questionKey || "general"}/${file.name}`
      : `${startup.id}/uploads/${uploadId}/${file.name}`;

    // Upload to R2 server-side
    const buffer = Buffer.from(await file.arrayBuffer());
    await uploadFile(storageKey, buffer, file.type);

    // Save metadata
    const [upload] = await db
      .insert(uploads)
      .values({
        id: uploadId,
        startupId: startup.id,
        userId,
        name: file.name,
        storageKey,
        mimeType: file.type,
        fileSize: file.size,
        domain: domain || null,
        assessmentId: assessmentId || null,
        questionKey: questionKey || null,
      })
      .returning();

    return Response.json({
      uploadId: upload.id,
      storageKey,
      fileName: file.name,
    });
  }

  // ─── JSON body (legacy presigned URL flow) ─────────────
  const { fileName, contentType: fileContentType, fileSize, domain, assessmentId, questionKey } =
    await req.json();

  if (!fileName || !fileContentType) {
    return Response.json(
      { error: "fileName and contentType are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(fileContentType)) {
    return Response.json(
      { error: "File type not allowed" },
      { status: 400 }
    );
  }

  if (fileSize && fileSize > MAX_FILE_SIZE) {
    return Response.json(
      { error: "File too large (max 10 MB)" },
      { status: 400 }
    );
  }

  let [startup] = await db
    .select()
    .from(startups)
    .where(eq(startups.userId, userId))
    .limit(1);

  if (!startup) {
    [startup] = await db
      .insert(startups)
      .values({ userId, name: "My Startup" })
      .returning();
  }

  const uploadId = crypto.randomUUID();
  const storageKey = assessmentId
    ? `${startup.id}/assessments/${assessmentId}/${questionKey || "general"}/${fileName}`
    : `${startup.id}/uploads/${uploadId}/${fileName}`;

  // Save metadata (file will be uploaded via presigned URL)
  const { getUploadUrl } = await import("@/lib/storage/r2");
  const presignedUrl = await getUploadUrl(storageKey, fileContentType);

  const [upload] = await db
    .insert(uploads)
    .values({
      id: uploadId,
      startupId: startup.id,
      userId,
      name: fileName,
      storageKey,
      mimeType: fileContentType,
      fileSize: fileSize || null,
      domain: domain || null,
      assessmentId: assessmentId || null,
      questionKey: questionKey || null,
    })
    .returning();

  return Response.json({
    uploadId: upload.id,
    presignedUrl,
    storageKey,
  });
}
