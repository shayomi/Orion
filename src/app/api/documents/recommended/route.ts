import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { legalIssues, startups } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";
import { matchIssueToTemplate } from "@/lib/documents/templates";

/**
 * GET /api/documents/recommended
 * Returns the user's unresolved issues that can be solved by generating a document,
 * matched to available templates.
 */
export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [startup] = await db
    .select({ id: startups.id })
    .from(startups)
    .where(eq(startups.userId, session.user.id))
    .limit(1);

  if (!startup) {
    return Response.json({ recommended: [], startup: null });
  }

  // Fetch startup details for prefilling forms
  const [startupDetails] = await db
    .select({
      name: startups.name,
      primaryJurisdiction: startups.primaryJurisdiction,
      stage: startups.stage,
    })
    .from(startups)
    .where(eq(startups.id, startup.id))
    .limit(1);

  const issues = await db
    .select({
      id: legalIssues.id,
      title: legalIssues.title,
      description: legalIssues.description,
      severity: legalIssues.severity,
      domain: legalIssues.domain,
      resolutionPath: legalIssues.resolutionPath,
    })
    .from(legalIssues)
    .where(
      and(
        eq(legalIssues.startupId, startup.id),
        eq(legalIssues.resolutionPath, "document_generation"),
        eq(legalIssues.isResolved, false)
      )
    );

  const recommended = issues
    .map((issue) => {
      const template = matchIssueToTemplate(issue.title);
      if (!template) return null;
      return {
        issueId: issue.id,
        issueTitle: issue.title,
        severity: issue.severity,
        templateId: template.id,
        templateName: template.name,
      };
    })
    .filter(Boolean);

  return Response.json({
    recommended,
    startup: startupDetails
      ? {
          name: startupDetails.name,
          jurisdiction: startupDetails.primaryJurisdiction,
          stage: startupDetails.stage,
        }
      : null,
  });
}
