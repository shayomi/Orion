import type { ProfileData, LegalDocument } from "./types";
import { getRelevantDocuments } from "./questions";

/**
 * Rules engine: analyses profile + document gaps and builds
 * a structured prompt for the AI legal team.
 */
export function buildAssessmentPrompt(
  profile: ProfileData,
  documentsHeld: string[]
): string {
  const relevantDocs = getRelevantDocuments(profile);
  const heldSet = new Set(documentsHeld);

  const docsHeld = relevantDocs.filter((d) => heldSet.has(d.id));
  const docsMissing = relevantDocs.filter((d) => !heldSet.has(d.id));

  // Group missing docs by domain
  const missingByDomain: Record<string, LegalDocument[]> = {};
  for (const doc of docsMissing) {
    if (!missingByDomain[doc.domain]) missingByDomain[doc.domain] = [];
    missingByDomain[doc.domain].push(doc);
  }

  // Build the structured brief
  const brief = `
YOU ARE A SENIOR LEGAL ADVISORY TEAM WITH 50 YEARS OF COMBINED EXPERIENCE IN STARTUP LAW.

You have been retained to perform a comprehensive legal health assessment for a startup. Below is the structured brief prepared by our intake system. Analyse everything and deliver your assessment.

═══════════════════════════════════════
STARTUP PROFILE
═══════════════════════════════════════
- Stage: ${profile.stage}
- Primary Jurisdiction: ${profile.jurisdiction}
- Co-founders: ${profile.cofounders}
- Team: ${profile.employees}
- Industry: ${profile.industry}
- Revenue: ${profile.hasRevenue ? "Yes" : "No / Pre-revenue"}
- Currently Raising: ${profile.raisingFunding ? "Yes" : "No"}

═══════════════════════════════════════
DOCUMENTS THE STARTUP HAS (${docsHeld.length})
═══════════════════════════════════════
${docsHeld.length > 0 ? docsHeld.map((d) => `✓ ${d.name} [${d.domain}]`).join("\n") : "None provided."}

═══════════════════════════════════════
DOCUMENTS MISSING (${docsMissing.length})
═══════════════════════════════════════
${docsMissing.length > 0 ? docsMissing.map((d) => `✗ ${d.name} [${d.domain}] — ${d.description}`).join("\n") : "All relevant documents are in place."}

═══════════════════════════════════════
GAPS BY LEGAL DOMAIN
═══════════════════════════════════════
${Object.entries(missingByDomain)
  .map(
    ([domain, docs]) =>
      `${domain.toUpperCase().replace("_", " ")} (${docs.length} gap${docs.length > 1 ? "s" : ""}):\n${docs.map((d) => `  - ${d.name}`).join("\n")}`
  )
  .join("\n\n")}

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
1. Score based on the COMBINATION of profile and gaps — a pre-seed solo founder missing bylaws is less critical than a seed-stage team of 4 missing a founder agreement.
2. Identify issues BEYOND just missing documents — flag risks based on the startup's profile (e.g., "You're raising funding without a clean cap table" or "Your jurisdiction requires specific compliance").
3. Severity must be honest — don't inflate to scare, don't downplay to comfort.
4. resolutionPath: "document_generation" if we can generate the doc, "self_serve" if the founder can handle it, "expert_referral" if it needs a lawyer.
5. Include ALL relevant domains in domainScores, even if score is 100.
6. priorityActions should be ordered by urgency and impact.
7. Write for founders — plain language, no jargon, explain why things matter.

Return ONLY the JSON object. No markdown, no code fences, no commentary.`;

  return brief;
}

/**
 * Enhanced prompt for re-evaluation — includes previous score,
 * documents generated since last check, and asks AI to comment
 * on the improvement.
 */
export function buildReevaluationPrompt(
  profile: ProfileData,
  documentsHeld: string[],
  generatedDocTypes: string[],
  previousScore: number,
  previousIssueCount: number
): string {
  const basePrompt = buildAssessmentPrompt(profile, documentsHeld);

  const reevalSection = `

═══════════════════════════════════════
DOCUMENTS GENERATED ON ORION SINCE LAST CHECK (${generatedDocTypes.length})
═══════════════════════════════════════
${generatedDocTypes.length > 0 ? generatedDocTypes.map((t) => `★ ${t} (generated and stored)`).join("\n") : "None generated yet."}

═══════════════════════════════════════
PREVIOUS ASSESSMENT
═══════════════════════════════════════
- Previous Legal Health Score: ${previousScore}/100
- Previous Active Issues: ${previousIssueCount}
- This is a RE-EVALUATION. The startup has been working to improve their legal health.

═══════════════════════════════════════
ADDITIONAL INSTRUCTIONS FOR RE-EVALUATION
═══════════════════════════════════════
1. Consider the generated documents as COMPLETED — they count as documents the startup now has.
2. Re-score all domains considering these new documents.
3. Add a "scoreChange" field to the JSON: the difference from the previous score (positive = improvement).
4. Add a "commentary" field: 2-3 sentences from the legal team commenting on the progress. Be encouraging if they improved, be direct if they haven't. Reference specific documents they generated. If the score jumped significantly, say something impressive. If barely moved, suggest what to focus on next.
5. Remove any issues that are now resolved by the generated documents.
6. Keep all other assessment rules from above.

The JSON must include these EXTRA fields alongside the standard ones:
  "scoreChange": <number, e.g. +15 or -2>,
  "previousScore": ${previousScore},
  "commentary": "<legal team's take on the progress>"

Return ONLY the JSON object. No markdown, no code fences, no commentary.`;

  // Insert re-eval section before the "Return ONLY" line
  return basePrompt.replace(
    "Return ONLY the JSON object. No markdown, no code fences, no commentary.",
    reevalSection
  );
}
