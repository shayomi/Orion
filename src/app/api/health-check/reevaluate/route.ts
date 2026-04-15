import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  startups,
  assessments,
  assessmentResponses,
  legalIssues,
  recommendations,
  documents,
} from "@/lib/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { buildReevaluationPrompt } from "@/lib/health-check/scoring";
import type { ProfileData } from "@/lib/health-check/types";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  // Get startup
  const [startup] = await db
    .select()
    .from(startups)
    .where(eq(startups.userId, userId))
    .limit(1);

  if (!startup) {
    return Response.json({ error: "No startup found" }, { status: 404 });
  }

  // Get latest assessment
  const [lastAssessment] = await db
    .select()
    .from(assessments)
    .where(eq(assessments.startupId, startup.id))
    .orderBy(desc(assessments.createdAt))
    .limit(1);

  if (!lastAssessment) {
    return Response.json({ error: "No previous assessment found" }, { status: 404 });
  }

  // Get profile from assessment responses
  const responses = await db
    .select({ questionId: assessmentResponses.questionId, answer: assessmentResponses.answer })
    .from(assessmentResponses)
    .where(eq(assessmentResponses.assessmentId, lastAssessment.id));

  const profileResponse = responses.find((r) => r.questionId === "profile");
  const docsResponse = responses.find((r) => r.questionId === "documents_held");

  if (!profileResponse) {
    return Response.json({ error: "No profile data found" }, { status: 404 });
  }

  const profile: ProfileData = JSON.parse(profileResponse.answer as string);
  const originalDocsHeld: string[] = docsResponse
    ? JSON.parse(docsResponse.answer as string)
    : [];

  // Get all generated documents for this startup
  const generatedDocs = await db
    .select({ type: documents.type, name: documents.name })
    .from(documents)
    .where(eq(documents.startupId, startup.id));

  const generatedDocTypes = generatedDocs.map((d) => d.name);

  // Get previous issue count
  const previousIssues = await db
    .select({ id: legalIssues.id })
    .from(legalIssues)
    .where(
      and(
        eq(legalIssues.startupId, startup.id),
        eq(legalIssues.isResolved, false)
      )
    );

  const previousScore = lastAssessment.overallScore ?? 0;

  // Build re-evaluation prompt
  const prompt = buildReevaluationPrompt(
    profile,
    originalDocsHeld,
    generatedDocTypes,
    previousScore,
    previousIssues.length
  );

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a senior legal advisory AI embedded in a startup legal platform. You are performing a RE-EVALUATION of a startup's legal health after they've taken action. Respond with valid JSON only — no markdown, no code fences, no commentary before or after the JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 4000,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return Response.json({ error: "Failed to generate re-evaluation" }, { status: 500 });
  }

  let result;
  try {
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    result = JSON.parse(cleaned);
  } catch {
    return Response.json({ error: "Failed to parse re-evaluation", raw }, { status: 500 });
  }

  // Mark old issues as resolved if they match generated doc types
  // (the AI will have removed them but we should also update DB)
  const oldIssues = await db
    .select({ id: legalIssues.id, title: legalIssues.title })
    .from(legalIssues)
    .where(
      and(
        eq(legalIssues.startupId, startup.id),
        eq(legalIssues.isResolved, false)
      )
    );

  const newIssueTitles = new Set((result.issues || []).map((i: { title: string }) => i.title.toLowerCase()));
  for (const oldIssue of oldIssues) {
    if (!newIssueTitles.has(oldIssue.title.toLowerCase())) {
      await db
        .update(legalIssues)
        .set({ isResolved: true, resolvedAt: new Date() })
        .where(eq(legalIssues.id, oldIssue.id));
    }
  }

  // Create new assessment record
  const [newAssessment] = await db
    .insert(assessments)
    .values({
      startupId: startup.id,
      status: "completed",
      overallScore: result.overallScore,
      riskLevel: result.riskLevel,
      completedAt: new Date(),
    })
    .returning();

  // Store responses
  await db.insert(assessmentResponses).values([
    {
      assessmentId: newAssessment.id,
      questionId: "profile",
      questionText: "Startup Profile",
      answer: JSON.stringify(profile),
      domain: "incorporation",
    },
    {
      assessmentId: newAssessment.id,
      questionId: "documents_held",
      questionText: "Documents the startup already has",
      answer: JSON.stringify(originalDocsHeld),
      domain: "general",
    },
    {
      assessmentId: newAssessment.id,
      questionId: "generated_documents",
      questionText: "Documents generated on platform",
      answer: JSON.stringify(generatedDocTypes),
      domain: "general",
    },
  ]);

  // Insert new issues
  for (const issue of result.issues || []) {
    const [dbIssue] = await db
      .insert(legalIssues)
      .values({
        assessmentId: newAssessment.id,
        startupId: startup.id,
        title: issue.title,
        description: issue.description,
        domain: issue.domain,
        severity: issue.severity,
        resolutionPath: issue.resolutionPath,
      })
      .returning();

    await db.insert(recommendations).values({
      issueId: dbIssue.id,
      title: issue.recommendation.title,
      description: issue.recommendation.description,
      actionType: issue.resolutionPath,
      priority: issue.severity === "critical" ? 0 : issue.severity === "high" ? 1 : 2,
    });
  }

  // Update startup risk score
  await db
    .update(startups)
    .set({ riskScore: result.overallScore, updatedAt: new Date() })
    .where(eq(startups.id, startup.id));

  return Response.json({
    overallScore: result.overallScore,
    previousScore,
    scoreChange: result.scoreChange ?? result.overallScore - previousScore,
    riskLevel: result.riskLevel,
    commentary: result.commentary || result.summary,
    summary: result.summary,
    domainScores: result.domainScores,
    issues: result.issues,
    priorityActions: result.priorityActions,
    generatedDocCount: generatedDocs.length,
  });
}
