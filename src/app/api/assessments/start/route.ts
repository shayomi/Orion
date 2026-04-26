import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { assessments, startups } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

/**
 * POST /api/assessments/start
 * Creates or resumes an in-progress assessment for the current user+template.
 * Body: { templateId }
 * Returns: { assessmentId }
 */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { templateId } = await req.json();

  if (!templateId) {
    return Response.json({ error: "templateId is required" }, { status: 400 });
  }

  // Get or create startup
  let [startup] = await db
    .select()
    .from(startups)
    .where(eq(startups.userId, userId))
    .limit(1);

  if (!startup) {
    [startup] = await db
      .insert(startups)
      .values({ userId, name: "My Startup" })
      .returning();
  }

  // Check for existing in-progress assessment for this template
  const [existing] = await db
    .select()
    .from(assessments)
    .where(
      and(
        eq(assessments.startupId, startup.id),
        eq(assessments.templateId, templateId),
        eq(assessments.status, "in_progress")
      )
    )
    .limit(1);

  if (existing) {
    return Response.json({ assessmentId: existing.id });
  }

  // Create new in-progress assessment
  const [assessment] = await db
    .insert(assessments)
    .values({
      startupId: startup.id,
      templateId,
      status: "in_progress",
    })
    .returning();

  return Response.json({ assessmentId: assessment.id });
}
