import { buildAssessmentPrompt } from "@/lib/health-check/scoring";
import type { ProfileData, HealthCheckResult } from "@/lib/health-check/types";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: Request) {
  const { profile, documentsHeld } = (await req.json()) as {
    profile: ProfileData;
    documentsHeld: string[];
  };

  if (!profile?.stage || !profile?.jurisdiction) {
    return Response.json(
      { error: "Profile with stage and jurisdiction is required" },
      { status: 400 }
    );
  }

  // Rules engine builds the structured prompt
  const prompt = buildAssessmentPrompt(profile, documentsHeld);

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content:
          "You are a senior legal advisory AI embedded in a startup legal platform. You assess startup legal health based on structured briefs. You MUST respond with valid JSON only — no markdown, no code fences, no commentary before or after the JSON.",
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

  // Parse the AI response
  let assessment: Omit<HealthCheckResult, "completedAt" | "profile" | "documentsHeld">;
  try {
    // Strip any markdown fences the model might add despite instructions
    const cleaned = raw.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
    assessment = JSON.parse(cleaned);
  } catch {
    return Response.json(
      { error: "Failed to parse assessment", raw },
      { status: 500 }
    );
  }

  const result: HealthCheckResult = {
    ...assessment,
    completedAt: new Date().toISOString(),
    profile,
    documentsHeld,
  };

  return Response.json(result);
}
