import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { uploads, startups } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getUploadUrl } from "@/lib/storage/r2";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_TYPES = [
  "application/pdf",
  "text/plain",
  "text/markdown",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/png",
  "image/jpeg",
];

/**
 * POST /api/documents/upload
 * Returns a presigned URL for the browser to upload directly to R2,
 * plus saves the file metadata in the uploads table.
 *
 * Body: { fileName, contentType, fileSize, domain? }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { fileName, contentType, fileSize, domain } = await req.json();

  if (!fileName || !contentType) {
    return Response.json(
      { error: "fileName and contentType are required" },
      { status: 400 }
    );
  }

  if (!ALLOWED_TYPES.includes(contentType)) {
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
  const ext = fileName.split(".").pop() || "bin";
  const storageKey = `${startup.id}/uploads/${uploadId}/${fileName}`;

  // Generate presigned URL for direct upload
  const presignedUrl = await getUploadUrl(storageKey, contentType);

  // Save metadata
  const [upload] = await db
    .insert(uploads)
    .values({
      id: uploadId,
      startupId: startup.id,
      userId,
      name: fileName,
      storageKey,
      mimeType: contentType,
      fileSize: fileSize || null,
      domain: domain || null,
    })
    .returning();

  return Response.json({
    uploadId: upload.id,
    presignedUrl,
    storageKey,
  });
}
