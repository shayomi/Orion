"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, startups, legalIssues, documents, uploads, assessmentAnswers, assessments } from "@/lib/db/schema";
import { eq, and, count, desc } from "drizzle-orm";

export interface DashboardData {
  user: {
    id: string;
    name: string;
    email: string;
    role: "member" | "admin";
    status: "active" | "suspended";
  };
  startup: {
    id: string;
    name: string;
    stage: string | null;
    structure: string | null;
    primaryJurisdiction: string | null;
    riskScore: number | null;
  } | null;
  stats: {
    documentCount: number;
    issueCount: number;
    resolvedCount: number;
    criticalCount: number;
  };
  issues: {
    id: string;
    title: string;
    severity: string;
    domain: string;
    isResolved: boolean;
  }[];
  recentDocs: {
    id: string;
    name: string;
    type: string;
    status: string;
    source: "generated" | "uploaded";
    createdAt: Date;
  }[];
  healthCheck: {
    overallScore: number;
    riskLevel: string;
    summary: string;
    domainScores: Record<string, { score: number; issues: number }>;
    priorityActions: string[];
    completedAt: string;
  } | null;
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Fetch user
  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;

  // Fetch startup
  const [startup] = await db
    .select({
      id: startups.id,
      name: startups.name,
      stage: startups.stage,
      structure: startups.structure,
      primaryJurisdiction: startups.primaryJurisdiction,
      riskScore: startups.riskScore,
    })
    .from(startups)
    .where(eq(startups.userId, userId))
    .limit(1);

  let stats = { documentCount: 0, issueCount: 0, resolvedCount: 0, criticalCount: 0 };
  let issues: DashboardData["issues"] = [];
  let recentDocs: DashboardData["recentDocs"] = [];
  let healthCheck: DashboardData["healthCheck"] = null;

  if (startup) {
    // Count documents (generated + uploaded)
    const [docCount] = await db
      .select({ value: count() })
      .from(documents)
      .where(eq(documents.startupId, startup.id));

    const [uploadCount] = await db
      .select({ value: count() })
      .from(uploads)
      .where(eq(uploads.startupId, startup.id));

    // Get issues
    const allIssues = await db
      .select({
        id: legalIssues.id,
        title: legalIssues.title,
        severity: legalIssues.severity,
        domain: legalIssues.domain,
        isResolved: legalIssues.isResolved,
      })
      .from(legalIssues)
      .where(eq(legalIssues.startupId, startup.id));

    issues = allIssues;
    const activeIssues = allIssues.filter((i) => !i.isResolved);

    stats = {
      documentCount: docCount.value + uploadCount.value,
      issueCount: activeIssues.length,
      resolvedCount: allIssues.filter((i) => i.isResolved).length,
      criticalCount: activeIssues.filter(
        (i) => i.severity === "critical" || i.severity === "high"
      ).length,
    };

    // Recent documents (generated + uploaded, merged)
    const generatedDocs = await db
      .select({
        id: documents.id,
        name: documents.name,
        type: documents.type,
        status: documents.status,
        createdAt: documents.createdAt,
      })
      .from(documents)
      .where(eq(documents.startupId, startup.id))
      .orderBy(desc(documents.createdAt))
      .limit(5);

    const uploadedDocs = await db
      .select({
        id: uploads.id,
        name: uploads.name,
        domain: uploads.domain,
        createdAt: uploads.createdAt,
      })
      .from(uploads)
      .where(eq(uploads.startupId, startup.id))
      .orderBy(desc(uploads.createdAt))
      .limit(5);

    recentDocs = [
      ...generatedDocs.map((d) => ({
        ...d,
        source: "generated" as const,
      })),
      ...uploadedDocs.map((u) => ({
        id: u.id,
        name: u.name,
        type: u.domain || "upload",
        status: "ready",
        source: "uploaded" as const,
        createdAt: u.createdAt,
      })),
    ]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Latest health check from assessmentAnswers
    const latestAnswerRows = await db
      .select({
        aiAnalysis: assessmentAnswers.aiAnalysis,
        completedAt: assessments.completedAt,
      })
      .from(assessmentAnswers)
      .innerJoin(assessments, eq(assessments.id, assessmentAnswers.assessmentId))
      .where(
        and(
          eq(assessmentAnswers.userId, userId),
          eq(assessments.status, "completed")
        )
      )
      .orderBy(desc(assessmentAnswers.createdAt))
      .limit(1);

    if (latestAnswerRows.length > 0 && latestAnswerRows[0].aiAnalysis) {
      const ai = latestAnswerRows[0].aiAnalysis as Record<string, unknown>;
      healthCheck = {
        overallScore: (ai.overallScore as number) ?? 0,
        riskLevel: (ai.riskLevel as string) ?? "info",
        summary: (ai.summary as string) ?? "",
        domainScores: (ai.domainScores as Record<string, { score: number; issues: number }>) ?? {},
        priorityActions: (ai.priorityActions as string[]) ?? [],
        completedAt: latestAnswerRows[0].completedAt?.toISOString() ?? new Date().toISOString(),
      };
    }
  }

  return {
    user: {
      id: user.id,
      name: user.name || "User",
      email: user.email,
      role: user.role,
      status: user.status,
    },
    startup: startup || null,
    stats,
    issues,
    recentDocs,
    healthCheck,
  };
}
