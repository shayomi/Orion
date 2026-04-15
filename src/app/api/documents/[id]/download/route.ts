import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { documents } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getFileUrl } from "@/lib/storage/r2";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [doc] = await db
    .select()
    .from(documents)
    .where(eq(documents.id, id))
    .limit(1);

  if (!doc) {
    return Response.json({ error: "Document not found" }, { status: 404 });
  }

  if (doc.userId !== session.user.id) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }

  // If stored in R2, redirect to signed URL
  if (doc.storageKey) {
    const url = await getFileUrl(doc.storageKey);
    return Response.redirect(url);
  }

  // Fallback: serve content directly from DB
  if (doc.content) {
    return new Response(doc.content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${doc.name}.md"`,
      },
    });
  }

  return Response.json({ error: "No content available" }, { status: 404 });
}
