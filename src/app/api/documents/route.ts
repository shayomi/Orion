import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { documents, uploads } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Fetch AI-generated documents
  const generatedDocs = await db
    .select({
      id: documents.id,
      name: documents.name,
      type: documents.type,
      status: documents.status,
      content: documents.content,
      createdAt: documents.createdAt,
    })
    .from(documents)
    .where(eq(documents.userId, session.user.id))
    .orderBy(desc(documents.createdAt));

  // Fetch user-uploaded files
  const uploadedDocs = await db
    .select({
      id: uploads.id,
      name: uploads.name,
      mimeType: uploads.mimeType,
      storageKey: uploads.storageKey,
      domain: uploads.domain,
      createdAt: uploads.createdAt,
    })
    .from(uploads)
    .where(eq(uploads.userId, session.user.id))
    .orderBy(desc(uploads.createdAt));

  // Merge with source tags
  const merged = [
    ...generatedDocs.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      status: d.status,
      content: d.content,
      source: "generated" as const,
      createdAt: d.createdAt,
    })),
    ...uploadedDocs.map((u) => ({
      id: u.id,
      name: u.name,
      type: u.domain || "upload",
      status: "ready" as const,
      content: null,
      source: "uploaded" as const,
      createdAt: u.createdAt,
    })),
  ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  return Response.json(merged);
}
