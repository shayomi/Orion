import type { LegalDocument, ProfileData } from "./types";

// ─── Profile Options ─────────────────────────────────────

export const stageOptions = [
  { value: "idea", label: "Idea / Pre-incorporation" },
  { value: "pre_seed", label: "Pre-seed (incorporated, building)" },
  { value: "seed", label: "Seed (raising or recently raised)" },
  { value: "series_a", label: "Series A+" },
];

export const jurisdictionOptions = [
  { value: "us_delaware", label: "United States (Delaware)" },
  { value: "us_other", label: "United States (Other state)" },
  { value: "uk", label: "United Kingdom" },
  { value: "nigeria", label: "Nigeria" },
  { value: "other", label: "Other jurisdiction" },
];

export const cofounderOptions = [
  { value: "solo", label: "Solo founder" },
  { value: "2", label: "2 co-founders" },
  { value: "3_4", label: "3-4 co-founders" },
  { value: "5_plus", label: "5+ co-founders" },
];

export const employeeOptions = [
  { value: "none", label: "No — just founders" },
  { value: "contractors", label: "Contractors only" },
  { value: "employees", label: "Employees (1-10)" },
  { value: "employees_10plus", label: "Employees (10+)" },
];

export const industryOptions = [
  { value: "saas", label: "SaaS / Software" },
  { value: "fintech", label: "Fintech" },
  { value: "healthtech", label: "Healthtech" },
  { value: "ecommerce", label: "E-commerce / Marketplace" },
  { value: "hardware", label: "Hardware / Deep Tech" },
  { value: "ai_ml", label: "AI / Machine Learning" },
  { value: "other", label: "Other" },
];

// ─── Legal Document Checklist ────────────────────────────

export const legalDocuments: LegalDocument[] = [
  // Incorporation
  {
    id: "cert_incorporation",
    name: "Certificate of Incorporation / Registration",
    domain: "incorporation",
    description: "Formal proof your company is legally registered",
    relevantWhen: () => true,
  },
  {
    id: "bylaws",
    name: "Bylaws / Articles of Association",
    domain: "incorporation",
    description: "Rules governing how the company operates",
    relevantWhen: (p) => p.stage !== "idea",
  },
  {
    id: "ein_tax_id",
    name: "EIN / Tax Identification Number",
    domain: "tax",
    description: "Tax registration with the relevant authority",
    relevantWhen: (p) => p.stage !== "idea",
  },
  {
    id: "registered_agent",
    name: "Registered Agent Appointment",
    domain: "incorporation",
    description: "Designated agent for receiving legal documents",
    relevantWhen: (p) => ["us_delaware", "us_other"].includes(p.jurisdiction),
  },

  // Equity & Founders
  {
    id: "founder_agreement",
    name: "Founder / Shareholder Agreement",
    domain: "equity",
    description: "Agreement between co-founders on equity, roles, and terms",
    relevantWhen: (p) => p.cofounders !== "solo",
  },
  {
    id: "vesting_agreements",
    name: "Vesting Schedule / Agreements",
    domain: "equity",
    description: "Equity vesting terms for founders and early team",
    relevantWhen: (p) => p.cofounders !== "solo",
  },
  {
    id: "cap_table",
    name: "Cap Table",
    domain: "equity",
    description: "Record of all equity ownership, options, and convertibles",
    relevantWhen: () => true,
  },
  {
    id: "83b_election",
    name: "83(b) Election Filing",
    domain: "tax",
    description: "US tax election filed within 30 days of receiving restricted stock",
    relevantWhen: (p) => ["us_delaware", "us_other"].includes(p.jurisdiction),
  },
  {
    id: "stock_option_plan",
    name: "Stock Option Plan (ESOP)",
    domain: "equity",
    description: "Formal plan for issuing stock options to employees",
    relevantWhen: (p) => ["employees", "employees_10plus"].includes(p.employees),
  },

  // Governance
  {
    id: "board_resolutions",
    name: "Board Resolutions / Meeting Minutes",
    domain: "governance",
    description: "Documented records of major company decisions",
    relevantWhen: (p) => p.stage !== "idea",
  },

  // Employment
  {
    id: "employment_contracts",
    name: "Employment Contracts",
    domain: "employment",
    description: "Signed agreements with all employees",
    relevantWhen: (p) => ["employees", "employees_10plus"].includes(p.employees),
  },
  {
    id: "contractor_agreements",
    name: "Contractor / Freelancer Agreements",
    domain: "employment",
    description: "Signed agreements with all contractors",
    relevantWhen: (p) => p.employees !== "none",
  },
  {
    id: "employee_handbook",
    name: "Employee Handbook / Policies",
    domain: "employment",
    description: "Internal policies covering conduct, leave, grievances",
    relevantWhen: (p) => ["employees", "employees_10plus"].includes(p.employees),
  },

  // IP
  {
    id: "ip_assignment",
    name: "IP Assignment Agreements",
    domain: "ip",
    description: "Formal assignment of IP rights from founders/contributors to the company",
    relevantWhen: () => true,
  },
  {
    id: "trademark_registration",
    name: "Trademark Registration / Application",
    domain: "ip",
    description: "Registered or applied-for brand name/logo protection",
    relevantWhen: () => true,
  },

  // Contracts
  {
    id: "terms_of_service",
    name: "Terms of Service / Customer Agreement",
    domain: "contracts",
    description: "Legal terms governing use of your product or service",
    relevantWhen: (p) => p.stage !== "idea",
  },
  {
    id: "nda_template",
    name: "NDA Template",
    domain: "contracts",
    description: "Standard non-disclosure agreement for sharing confidential info",
    relevantWhen: () => true,
  },

  // Data & Privacy
  {
    id: "privacy_policy",
    name: "Privacy Policy",
    domain: "data_privacy",
    description: "Policy describing how you collect, use, and protect user data",
    relevantWhen: (p) => p.stage !== "idea",
  },
  {
    id: "data_processing_agreements",
    name: "Data Processing Agreements (DPAs)",
    domain: "data_privacy",
    description: "Agreements with third-party services that process your user data",
    relevantWhen: (p) => p.stage !== "idea",
  },
  {
    id: "cookie_policy",
    name: "Cookie / Tracking Policy",
    domain: "data_privacy",
    description: "Disclosure of cookies and tracking on your website or app",
    relevantWhen: (p) => p.stage !== "idea",
  },

  // Investment
  {
    id: "safe_notes",
    name: "SAFEs / Convertible Notes",
    domain: "investment_readiness",
    description: "Investment instruments from prior or current raises",
    relevantWhen: (p) => p.raisingFunding || p.stage === "seed" || p.stage === "series_a",
  },
  {
    id: "data_room",
    name: "Organised Data Room",
    domain: "investment_readiness",
    description: "Central repository of all key documents for due diligence",
    relevantWhen: (p) => p.raisingFunding || p.stage === "seed" || p.stage === "series_a",
  },
];

/** Get documents relevant to a profile */
export function getRelevantDocuments(profile: ProfileData): LegalDocument[] {
  return legalDocuments.filter(
    (doc) => !doc.relevantWhen || doc.relevantWhen(profile)
  );
}
