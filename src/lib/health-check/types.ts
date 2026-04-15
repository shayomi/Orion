export type Domain =
  | "incorporation"
  | "equity"
  | "governance"
  | "employment"
  | "ip"
  | "contracts"
  | "data_privacy"
  | "regulation"
  | "tax"
  | "investment_readiness";

// ─── Profile (step 1) ────────────────────────────────────

export interface ProfileData {
  stage: string;
  jurisdiction: string;
  cofounders: string;
  employees: string;
  industry: string;
  hasRevenue: boolean;
  raisingFunding: boolean;
}

// ─── Document Checklist (step 2) ─────────────────────────

export interface LegalDocument {
  id: string;
  name: string;
  domain: Domain;
  description: string;
  /** When is this document relevant */
  relevantWhen?: (profile: ProfileData) => boolean;
}

// ─── AI Assessment Output ────────────────────────────────

export interface IssueFinding {
  id: string;
  domain: Domain;
  title: string;
  description: string;
  severity: "critical" | "high" | "medium" | "low" | "info";
  resolutionPath: "self_serve" | "document_generation" | "expert_referral";
  recommendation: {
    title: string;
    description: string;
  };
}

export interface HealthCheckResult {
  overallScore: number;
  riskLevel: "critical" | "high" | "medium" | "low" | "info";
  domainScores: Record<string, { score: number; issues: number }>;
  issues: IssueFinding[];
  summary: string;
  priorityActions: string[];
  completedAt: string;
  profile: ProfileData;
  documentsHeld: string[];
}
