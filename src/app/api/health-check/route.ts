import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  assessmentTemplates,
  assessmentTemplateSections,
  assessmentTemplateQuestions,
  startups,
  assessments,
  assessmentAnswers,
  legalIssues,
  recommendations,
} from "@/lib/db/schema";
import { eq, inArray, asc } from "drizzle-orm";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { templateId, answers } = (await req.json()) as {
    templateId: string;
    answers: Record<string, string | string[]>;
  };

  if (!templateId || !answers || Object.keys(answers).length === 0) {
    return Response.json(
      { error: "templateId and answers are required" },
      { status: 400 }
    );
  }

  // Check auth — persist to DB if authenticated, otherwise guest flow
  const session = await auth();
  const userId = session?.user?.id;

  // Fetch template, sections, and questions from DB
  const [template] = await db
    .select()
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.id, templateId))
    .limit(1);

  if (!template) {
    return Response.json({ error: "Template not found" }, { status: 404 });
  }

  const sections = await db
    .select()
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.templateId, templateId))
    .orderBy(asc(assessmentTemplateSections.orderIndex));

  const sectionIds = sections.map((s) => s.id);
  const questions = sectionIds.length
    ? await db
        .select()
        .from(assessmentTemplateQuestions)
        .where(inArray(assessmentTemplateQuestions.sectionId, sectionIds))
        .orderBy(asc(assessmentTemplateQuestions.orderIndex))
    : [];

  // Build structured brief from answers
  const sectionMap = new Map(sections.map((s) => [s.id, s]));
  const questionsBySection = new Map<string, typeof questions>();
  for (const q of questions) {
    const list = questionsBySection.get(q.sectionId) ?? [];
    list.push(q);
    questionsBySection.set(q.sectionId, list);
  }

  let briefSections = "";
  for (const section of sections) {
    const sectionQuestions = questionsBySection.get(section.id) ?? [];
    const answeredQuestions = sectionQuestions.filter((q) => {
      const val = answers[q.questionKey];
      if (Array.isArray(val)) return val.length > 0;
      return !!val;
    });

    if (answeredQuestions.length === 0) continue;

    briefSections += `\n═══════════════════════════════════════\n`;
    briefSections += `${section.title.toUpperCase()}\n`;
    briefSections += `═══════════════════════════════════════\n`;

    for (const q of answeredQuestions) {
      const val = answers[q.questionKey];
      const displayVal = Array.isArray(val) ? val.join(", ") : val;
      briefSections += `Q: ${q.prompt}\n`;
      briefSections += `A: ${displayVal}\n\n`;
    }
  }

  // Collect domains from answered questions
  const answeredDomains = [
    ...new Set(
      questions
        .filter((q) => {
          const val = answers[q.questionKey];
          if (Array.isArray(val)) return val.length > 0;
          return !!val;
        })
        .map((q) => q.domain)
        .filter(Boolean)
    ),
  ];

  const prompt = `
YOU ARE A SENIOR LEGAL ADVISORY TEAM WITH 50 YEARS OF COMBINED EXPERIENCE IN STARTUP LAW.

You have been retained to perform a comprehensive legal health assessment for a startup. Below is the structured intake questionnaire completed by the founder. Analyse every answer carefully and deliver your assessment.

${briefSections}

═══════════════════════════════════════
LEGAL DOMAINS COVERED
═══════════════════════════════════════
${answeredDomains.join(", ")}

═══════════════════════════════════════
YOUR ASSESSMENT INSTRUCTIONS
═══════════════════════════════════════

Deliver your response as valid JSON matching this exact structure:

{
  "overallScore": <number 0-100, higher = healthier>,
  "riskLevel": "<critical|high|medium|low|info>",
  "summary": "<2-3 sentence executive summary of the startup's legal health>",
  "domainScores": {
    "<domain>": { "score": <0-100>, "issues": <count> }
  },
  "issues": [
    {
      "id": "<unique_id>",
      "domain": "<domain>",
      "title": "<concise issue title>",
      "description": "<2-3 sentence explanation of WHY this matters, written for a founder, not a lawyer>",
      "severity": "<critical|high|medium|low|info>",
      "resolutionPath": "<self_serve|document_generation|expert_referral>",
      "recommendation": {
        "title": "<action title>",
        "description": "<specific, actionable next step>"
      }
    }
  ],
  "priorityActions": [
    "<top 3-5 things this startup should do FIRST, in priority order>"
  ]
}

ASSESSMENT RULES:
1. Score based on the COMBINATION of all answers — identify gaps, missing documents, compliance issues, and structural risks.
2. Identify issues BEYOND just what's explicitly stated — flag risks based on the startup's profile (e.g., "You're raising funding without a clean cap table" or "Your jurisdiction requires specific compliance").
3. Severity must be honest — don't inflate to scare, don't downplay to comfort.
4. resolutionPath: "document_generation" if we can generate the doc, "self_serve" if the founder can handle it, "expert_referral" if it needs a lawyer.
5. Include ALL relevant domains in domainScores, even if score is 100.
6. priorityActions should be ordered by urgency and impact.
7. Write for founders — plain language, no jargon, explain why things matter.
8. If an answer is "No" to a question about having a document or compliance item, that's a gap — assess accordingly.

Return ONLY the JSON object. No markdown, no code fences, no commentary.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a senior legal advisory AI embedded in a startup legal platform. You assess startup legal health based on structured questionnaire responses. You MUST respond with valid JSON only — no markdown, no code fences, no commentary before or after the JSON.",
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.4,
    max_tokens: 4000,
  });

  const raw = completion.choices[0]?.message?.content;
  if (!raw) {
    return Response.json(
      { error: "Failed to generate assessment" },
      { status: 500 }
    );
  }

  let assessment;
  try {
    const cleaned = raw
      .replace(/```json\n?/g, "")
      .replace(/```\n?/g, "")
      .trim();
    assessment = JSON.parse(cleaned);
  } catch {
    return Response.json(
      { error: "Failed to parse assessment", raw },
      { status: 500 }
    );
  }

  const result = {
    ...assessment,
    completedAt: new Date().toISOString(),
    templateId,
    answeredQuestions: Object.keys(answers).length,
    totalQuestions: questions.length,
  };

  // Persist to DB for authenticated users
  if (userId) {
    try {
      // Get or create startup
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
            riskScore: assessment.overallScore ?? null,
          })
          .returning();
      } else {
        await db
          .update(startups)
          .set({ riskScore: assessment.overallScore, updatedAt: new Date() })
          .where(eq(startups.id, startup.id));
      }

      // Create assessment record
      const [assessmentRecord] = await db
        .insert(assessments)
        .values({
          startupId: startup.id,
          templateId,
          status: "completed",
          overallScore: assessment.overallScore,
          riskLevel: assessment.riskLevel,
          completedAt: new Date(),
        })
        .returning();

      // Store raw answers + AI analysis side-by-side
      await db.insert(assessmentAnswers).values({
        userId,
        assessmentId: assessmentRecord.id,
        rawAnswers: answers,
        aiAnalysis: assessment,
      });

      // Insert legal issues + recommendations
      for (const issue of assessment.issues ?? []) {
        const [dbIssue] = await db
          .insert(legalIssues)
          .values({
            assessmentId: assessmentRecord.id,
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

      return Response.json({ ...result, assessmentId: assessmentRecord.id });
    } catch (dbErr) {
      // DB persistence failed — still return the result to the client
      console.error("Failed to persist health check to DB:", dbErr);
    }
  }

  return Response.json(result);
}
