import { db } from "@/lib/db";
import { uploads } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getFileUrl } from "@/lib/storage/r2";
import { requireActiveAdmin } from "@/lib/admin";

/**
 * GET /api/admin/uploads/[uploadId]/download
 * Admin-only: generates a signed R2 URL and redirects to it.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ uploadId: string }> }
) {
  await requireActiveAdmin();

  const { uploadId } = await params;

  const [upload] = await db
    .select()
    .from(uploads)
    .where(eq(uploads.id, uploadId))
    .limit(1);

  if (!upload) {
    return Response.json({ error: "Upload not found" }, { status: 404 });
  }

  const signedUrl = await getFileUrl(upload.storageKey);

  return Response.redirect(signedUrl);
}
