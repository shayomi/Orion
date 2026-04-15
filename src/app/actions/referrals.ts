"use server";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { referrals, legalIssues, auditLog, startups } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function createReferral(data: {
  issueId: string;
  issueSummary: string;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "You must be signed in" };
  }

  const userId = session.user.id;

  // Get the issue to find the startup
  const [issue] = await db
    .select()
    .from(legalIssues)
    .where(eq(legalIssues.id, data.issueId))
    .limit(1);

  if (!issue) {
    return { error: "Issue not found" };
  }

  const [referral] = await db
    .insert(referrals)
    .values({
      issueId: data.issueId,
      startupId: issue.startupId,
      userId,
      status: "requested",
      issueSummary: data.issueSummary,
    })
    .returning();

  await db.insert(auditLog).values({
    userId,
    action: "referral_created",
    entityType: "referral",
    entityId: referral.id,
    details: { issueId: data.issueId, issueTitle: issue.title },
  });

  return { success: true, referralId: referral.id };
}

export async function getUserReferrals() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  return db
    .select({
      id: referrals.id,
      status: referrals.status,
      issueSummary: referrals.issueSummary,
      providerNotes: referrals.providerNotes,
      createdAt: referrals.createdAt,
      updatedAt: referrals.updatedAt,
      issueTitle: legalIssues.title,
      issueSeverity: legalIssues.severity,
      issueDomain: legalIssues.domain,
    })
    .from(referrals)
    .innerJoin(legalIssues, eq(referrals.issueId, legalIssues.id))
    .where(eq(referrals.userId, session.user.id))
    .orderBy(desc(referrals.createdAt));
}

export async function getUserIssues() {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const [startup] = await db
    .select()
    .from(startups)
    .where(eq(startups.userId, session.user.id))
    .limit(1);

  if (!startup) return [];

  return db
    .select({
      id: legalIssues.id,
      title: legalIssues.title,
      description: legalIssues.description,
      domain: legalIssues.domain,
      severity: legalIssues.severity,
      resolutionPath: legalIssues.resolutionPath,
      isResolved: legalIssues.isResolved,
    })
    .from(legalIssues)
    .where(eq(legalIssues.startupId, startup.id))
    .orderBy(desc(legalIssues.severity));
}
