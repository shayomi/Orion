"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users, startups, legalIssues, documents } from "@/lib/db/schema";
import { eq, and, count, desc } from "drizzle-orm";

export interface DashboardData {
  user: { id: string; name: string; email: string };
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
    createdAt: Date;
  }[];
}

export async function getDashboardData(): Promise<DashboardData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const userId = session.user.id;

  // Fetch user
  const [user] = await db
    .select({ id: users.id, name: users.name, email: users.email })
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

  if (startup) {
    // Count documents
    const [docCount] = await db
      .select({ value: count() })
      .from(documents)
      .where(eq(documents.startupId, startup.id));

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
      documentCount: docCount.value,
      issueCount: activeIssues.length,
      resolvedCount: allIssues.filter((i) => i.isResolved).length,
      criticalCount: activeIssues.filter(
        (i) => i.severity === "critical" || i.severity === "high"
      ).length,
    };

    // Recent documents (last 5)
    recentDocs = await db
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
  }

  return {
    user: { id: user.id, name: user.name || "User", email: user.email },
    startup: startup || null,
    stats,
    issues,
    recentDocs,
  };
}
