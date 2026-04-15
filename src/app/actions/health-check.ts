"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  assessments,
  assessmentResponses,
  legalIssues,
  recommendations,
  startups,
  users,
} from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import type { HealthCheckResult } from "@/lib/health-check/types";

/**
 * Persist a guest health check result to the database after signup.
 * Creates a default startup profile if none exists.
 */
export async function persistHealthCheck(resultJson: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in to save results" };
  }

  const userId = session.user.id;

  // Verify user still exists in DB (session JWT may outlive deleted user)
  const [userExists] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!userExists) {
    return { error: "Your account no longer exists. Please sign up again." };
  }

  const result: HealthCheckResult = JSON.parse(resultJson);

  // Get or create a startup for this user
  let [startup] = await db
    .select()
    .from(startups)
    .where(eq(startups.userId, userId))
    .limit(1);

  if (!startup) {
    const profile = result.profile;
    const stageMap: Record<string, "idea" | "pre_seed" | "seed" | "series_a"> = {
      idea: "idea",
      pre_seed: "pre_seed",
      seed: "seed",
      series_a: "series_a",
    };

    [startup] = await db
      .insert(startups)
      .values({
        userId,
        name: "My Startup",
        stage: stageMap[profile?.stage] ?? null,
        primaryJurisdiction: profile?.jurisdiction ?? null,
        riskScore: result.overallScore,
      })
      .returning();
  }

  // Create assessment record
  const [assessment] = await db
    .insert(assessments)
    .values({
      startupId: startup.id,
      status: "completed",
      overallScore: result.overallScore,
      riskLevel: result.riskLevel,
      completedAt: new Date(result.completedAt),
    })
    .returning();

  // Store profile + documents as assessment responses
  const responseEntries = [
    {
      assessmentId: assessment.id,
      questionId: "profile",
      questionText: "Startup Profile",
      answer: JSON.stringify(result.profile),
      domain: "incorporation",
    },
    {
      assessmentId: assessment.id,
      questionId: "documents_held",
      questionText: "Documents the startup already has",
      answer: JSON.stringify(result.documentsHeld),
      domain: "general",
    },
  ];

  await db.insert(assessmentResponses).values(responseEntries);

  // Insert issues and their recommendations
  for (const issue of result.issues) {
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

  return { success: true, assessmentId: assessment.id, startupId: startup.id };
}
