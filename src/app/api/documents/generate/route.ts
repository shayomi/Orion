import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { documents, startups, auditLog } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import { getTemplate } from "@/lib/documents/templates";
import { uploadFile } from "@/lib/storage/r2";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { templateId, fields } = await req.json();

  const template = getTemplate(templateId);
  if (!template) {
    return Response.json({ error: "Template not found" }, { status: 404 });
  }

  // Validate required fields
  for (const field of template.fields) {
    if (field.required && !fields[field.id]) {
      return Response.json(
        { error: `${field.label} is required` },
        { status: 400 }
      );
    }
  }

  // Get or create user's startup
  let [startup] = await db
    .select()
    .from(startups)
    .where(eq(startups.userId, userId))
    .limit(1);

  if (!startup) {
    [startup] = await db
      .insert(startups)
      .values({
        userId,
        name: "My Startup",
      })
      .returning();
  }

  // Build the prompt
  const fieldSummary = template.fields
    .map((f) => `${f.label}: ${fields[f.id] || "Not provided"}`)
    .join("\n");

  const prompt = `${template.promptInstructions}

DOCUMENT DETAILS:
${fieldSummary}

Generate the full document text now. Use professional legal language but keep it readable. Format with clear section headers (use markdown ## for sections). Do not include signature lines or execution blocks.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a legal document generation engine for a startup legal platform. You generate professional, jurisdiction-appropriate legal documents based on templates and user inputs. Output only the document text in markdown format — no preamble, no commentary.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.3,
    max_tokens: 4000,
  });

  const content = completion.choices[0]?.message?.content;
  if (!content) {
    return Response.json({ error: "Failed to generate document" }, { status: 500 });
  }

  // Upload to R2
  const docId = crypto.randomUUID();
  const storageKey = `${startup.id}/generated/${docId}/${template.type}.md`;
  await uploadFile(storageKey, content, "text/markdown");

  // Save to database
  const [doc] = await db
    .insert(documents)
    .values({
      id: docId,
      startupId: startup.id,
      userId,
      name: `${template.name} — ${fields[template.fields[0].id] || "Draft"}`,
      type: template.type,
      status: "ready",
      templateId: template.id,
      inputData: fields,
      content,
      storageKey,
      mimeType: "text/markdown",
      fileSize: Buffer.byteLength(content, "utf-8"),
      jurisdiction: fields.jurisdiction || null,
    })
    .returning();

  // Audit log
  await db.insert(auditLog).values({
    userId,
    action: "document_generated",
    entityType: "document",
    entityId: doc.id,
    details: { templateId: template.id, templateName: template.name },
  });

  return Response.json({
    id: doc.id,
    name: doc.name,
    content,
    type: doc.type,
    createdAt: doc.createdAt,
  });
}
