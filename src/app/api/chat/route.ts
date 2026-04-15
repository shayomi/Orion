import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { startups, legalIssues, chatMessages } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const SYSTEM_PROMPT = `You are Orion, an AI legal co-pilot for startup founders. You are embedded in a legal health platform.

RULES — follow these exactly:
1. You explain legal concepts in plain, founder-friendly language.
2. You NEVER claim to provide legal advice. Every response must end with a brief disclaimer.
3. You suggest concrete next steps the founder can take.
4. For high-risk or complex matters (litigation, tax disputes, regulatory investigations), you MUST recommend speaking to a qualified lawyer.
5. You are aware of the founder's startup profile and any legal issues flagged by the platform. Use this context to give relevant, specific answers.
6. Keep responses concise — founders are busy. Use bullet points and bold for key terms.
7. If asked about something outside your knowledge, say so honestly.
8. You cover: incorporation, equity, governance, employment, IP, contracts, data privacy, regulation, tax, and investment readiness.

DISCLAIMER (include a version of this at the end of every response):
"This is general guidance, not legal advice. For binding decisions, consult a licensed attorney in your jurisdiction."`;

function buildContextMessage(
  startup: { name: string; stage: string | null; structure: string | null; primaryJurisdiction: string | null; riskScore: number | null },
  issues: { title: string; severity: string; domain: string; isResolved: boolean }[]
) {
  const activeIssues = issues.filter((i) => !i.isResolved);
  let context = `STARTUP CONTEXT:\n- Company: ${startup.name}`;
  if (startup.stage) context += `\n- Stage: ${startup.stage}`;
  if (startup.structure) context += `\n- Structure: ${startup.structure}`;
  if (startup.primaryJurisdiction) context += `\n- Jurisdiction: ${startup.primaryJurisdiction}`;
  if (startup.riskScore !== null) context += `\n- Legal Health Score: ${startup.riskScore}/100`;

  if (activeIssues.length > 0) {
    context += `\n\nACTIVE LEGAL ISSUES (${activeIssues.length}):`;
    for (const issue of activeIssues.slice(0, 10)) {
      context += `\n- [${issue.severity.toUpperCase()}] ${issue.title} (${issue.domain})`;
    }
  } else {
    context += `\n\nNo active legal issues flagged.`;
  }

  return context;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { message, startupId } = await req.json();

  if (!message || typeof message !== "string") {
    return Response.json({ error: "Message is required" }, { status: 400 });
  }

  // Load startup context
  let contextMessage = "";
  let resolvedStartupId = startupId;

  let [startup] = startupId
    ? await db.select().from(startups).where(eq(startups.id, startupId)).limit(1)
    : await db.select().from(startups).where(eq(startups.userId, userId)).limit(1);

  if (!startup) {
    [startup] = await db
      .insert(startups)
      .values({ userId, name: "My Startup" })
      .returning();
  }

  if (startup) {
    resolvedStartupId = startup.id;
    const issues = await db
      .select({
        title: legalIssues.title,
        severity: legalIssues.severity,
        domain: legalIssues.domain,
        isResolved: legalIssues.isResolved,
      })
      .from(legalIssues)
      .where(eq(legalIssues.startupId, startup.id));

    contextMessage = buildContextMessage(startup, issues);
  }

  // Load recent chat history for continuity (last 10 messages)
  const recentMessages = resolvedStartupId
    ? await db
        .select({ role: chatMessages.role, content: chatMessages.content })
        .from(chatMessages)
        .where(eq(chatMessages.startupId, resolvedStartupId))
        .orderBy(desc(chatMessages.createdAt))
        .limit(10)
    : [];

  // Build messages array for OpenAI
  const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: "system", content: SYSTEM_PROMPT },
  ];

  if (contextMessage) {
    messages.push({ role: "system", content: contextMessage });
  }

  // Add recent history (reversed to chronological order)
  for (const msg of recentMessages.reverse()) {
    messages.push({
      role: msg.role as "user" | "assistant",
      content: msg.content,
    });
  }

  messages.push({ role: "user", content: message });

  // Save user message to DB
  if (resolvedStartupId) {
    await db.insert(chatMessages).values({
      userId,
      startupId: resolvedStartupId,
      role: "user",
      content: message,
    });
  }

  // Stream response from OpenAI
  const stream = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    stream: true,
    temperature: 0.7,
    max_tokens: 1000,
  });

  let fullResponse = "";

  const encoder = new TextEncoder();
  const readable = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content;
        if (content) {
          fullResponse += content;
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`));
        }
      }

      // Save assistant response to DB
      if (resolvedStartupId && fullResponse) {
        await db.insert(chatMessages).values({
          userId,
          startupId: resolvedStartupId,
          role: "assistant",
          content: fullResponse,
        });
      }

      controller.enqueue(encoder.encode(`data: [DONE]\n\n`));
      controller.close();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
