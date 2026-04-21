import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  startups,
  assessments,
  assessmentResponses,
  legalIssues,
  recommendations,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { templateId, answers, result } = await req.json();

  if (!templateId || !answers || !result) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  // Get or create startup for this user
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
        riskScore: result.overallScore ?? null,
      })
      .returning();
  } else {
    await db
      .update(startups)
      .set({ riskScore: result.overallScore, updatedAt: new Date() })
      .where(eq(startups.id, startup.id));
  }

  // Create assessment record
  const [assessment] = await db
    .insert(assessments)
    .values({
      startupId: startup.id,
      status: "completed",
      overallScore: result.overallScore,
      riskLevel: result.riskLevel,
      completedAt: new Date(),
    })
    .returning();

  // Store all answers as assessment responses
  const responseEntries = Object.entries(answers).map(([key, value]) => ({
    assessmentId: assessment.id,
    questionId: key,
    questionText: key,
    answer: typeof value === "string" ? value : JSON.stringify(value),
    domain: "general",
  }));

  if (responseEntries.length > 0) {
    await db.insert(assessmentResponses).values(responseEntries);
  }

  // Insert issues and recommendations
  for (const issue of result.issues ?? []) {
    const [dbIssue] = await db
      .insert(legalIssues)
      .values({
        assessmentId: assessment.id,
        startupId: startup.id,
        title: issue.title,
        description: issue.description,
        domain: issue.domain,
        severity: issue.severity,
        resolutionPath: issue.resolutionPath,
      })
      .returning();

    if (issue.recommendation) {
      await db.insert(recommendations).values({
        issueId: dbIssue.id,
        title: issue.recommendation.title,
        description: issue.recommendation.description,
        actionType: issue.resolutionPath,
        priority:
          issue.severity === "critical"
            ? 0
            : issue.severity === "high"
              ? 1
              : 2,
      });
    }
  }

  return Response.json({ success: true, assessmentId: assessment.id });
}
