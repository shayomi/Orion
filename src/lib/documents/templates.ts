export interface TemplateField {
  id: string;
  label: string;
  type: "text" | "date" | "select" | "textarea";
  placeholder?: string;
  required: boolean;
  options?: { value: string; label: string }[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  type: string;
  description: string;
  category: string;
  fields: TemplateField[];
  promptInstructions: string;
}

const jurisdictionOptions = [
  { value: "delaware", label: "Delaware, USA" },
  { value: "california", label: "California, USA" },
  { value: "new_york", label: "New York, USA" },
  { value: "england_wales", label: "England & Wales" },
  { value: "nigeria", label: "Nigeria" },
  { value: "singapore", label: "Singapore" },
];

export const templates: DocumentTemplate[] = [
  // ─── General / Contracts ──────────────────────────────────
  {
    id: "nda",
    name: "Non-Disclosure Agreement",
    type: "NDA",
    description: "Mutual or one-way NDA for protecting confidential information when sharing with partners, investors, or contractors.",
    category: "contracts",
    fields: [
      { id: "disclosing_party", label: "Disclosing Party (Company Name)", type: "text", placeholder: "Your Company Ltd", required: true },
      { id: "receiving_party", label: "Receiving Party (Name/Company)", type: "text", placeholder: "John Doe / Acme Inc", required: true },
      { id: "nda_type", label: "NDA Type", type: "select", required: true, options: [
        { value: "mutual", label: "Mutual (both parties)" },
        { value: "one_way", label: "One-way (disclosing party only)" },
      ]},
      { id: "purpose", label: "Purpose of Disclosure", type: "textarea", placeholder: "e.g. Exploring a potential business partnership", required: true },
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "duration", label: "Confidentiality Period", type: "select", required: true, options: [
        { value: "1_year", label: "1 Year" },
        { value: "2_years", label: "2 Years" },
        { value: "3_years", label: "3 Years" },
        { value: "5_years", label: "5 Years" },
      ]},
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a professional Non-Disclosure Agreement. Include: definitions of confidential information, obligations of receiving party, exclusions from confidentiality, term and termination, remedies for breach, and governing law. The NDA should be clear, enforceable, and appropriate for a startup context. Do NOT include signature blocks — just the body of the agreement with section headers.`,
  },
  {
    id: "terms_of_service",
    name: "Terms of Service",
    type: "Terms of Service",
    description: "Legal terms governing the use of your product or service by customers and users.",
    category: "contracts",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "Your Company Ltd", required: true },
      { id: "product_name", label: "Product / Service Name", type: "text", placeholder: "e.g. Orion Platform", required: true },
      { id: "product_type", label: "Product Type", type: "select", required: true, options: [
        { value: "saas", label: "SaaS / Web Application" },
        { value: "marketplace", label: "Marketplace" },
        { value: "mobile_app", label: "Mobile App" },
        { value: "api", label: "API / Developer Platform" },
        { value: "other", label: "Other" },
      ]},
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "payment_model", label: "Payment Model", type: "select", required: true, options: [
        { value: "free", label: "Free" },
        { value: "freemium", label: "Freemium" },
        { value: "subscription", label: "Subscription" },
        { value: "one_time", label: "One-time payment" },
      ]},
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate professional Terms of Service for a startup product. Include: acceptance of terms, account registration, permitted use, prohibited conduct, intellectual property rights, user content and licenses, payment and billing terms (if applicable), disclaimers and limitation of liability, indemnification, termination, dispute resolution, governing law, and modifications to terms. Make it comprehensive but readable.`,
  },

  // ─── Incorporation ────────────────────────────────────────
  {
    id: "bylaws",
    name: "Bylaws / Articles of Association",
    type: "Bylaws",
    description: "Rules governing how the company operates, including board structure, officer roles, and decision-making.",
    category: "incorporation",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "Your Company Ltd", required: true },
      { id: "entity_type", label: "Entity Type", type: "select", required: true, options: [
        { value: "c_corp", label: "C-Corporation" },
        { value: "llc", label: "LLC" },
        { value: "ltd", label: "Private Limited Company (Ltd)" },
        { value: "rc", label: "Registered Company (RC)" },
      ]},
      { id: "jurisdiction", label: "Jurisdiction of Incorporation", type: "select", required: true, options: jurisdictionOptions },
      { id: "num_directors", label: "Number of Initial Directors", type: "select", required: true, options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
        { value: "5", label: "5" },
      ]},
      { id: "fiscal_year_end", label: "Fiscal Year End", type: "select", required: true, options: [
        { value: "dec_31", label: "December 31" },
        { value: "mar_31", label: "March 31" },
        { value: "jun_30", label: "June 30" },
        { value: "sep_30", label: "September 30" },
      ]},
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate comprehensive Bylaws (or Articles of Association for UK/Nigeria entities). Include: corporate name and purpose, principal office, shareholders/members (meetings, quorum, voting, proxies), board of directors (number, election, meetings, quorum, removal, vacancies), officers (roles, duties, appointment, removal), indemnification, shares/equity (classes, transfers, certificates), amendments, fiscal year, and general provisions. Tailor to the specific entity type and jurisdiction provided.`,
  },

  // ─── Equity ───────────────────────────────────────────────
  {
    id: "founder_agreement",
    name: "Founder Agreement",
    type: "Founder Agreement",
    description: "Comprehensive agreement between co-founders covering equity, vesting, roles, IP assignment, and departure terms.",
    category: "equity",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "TechStartup Inc.", required: true },
      { id: "founder_1_name", label: "Founder 1 Full Name", type: "text", placeholder: "Jane Smith", required: true },
      { id: "founder_1_equity", label: "Founder 1 Equity (%)", type: "text", placeholder: "50", required: true },
      { id: "founder_1_role", label: "Founder 1 Role", type: "text", placeholder: "CEO", required: true },
      { id: "founder_2_name", label: "Founder 2 Full Name", type: "text", placeholder: "John Doe", required: true },
      { id: "founder_2_equity", label: "Founder 2 Equity (%)", type: "text", placeholder: "50", required: true },
      { id: "founder_2_role", label: "Founder 2 Role", type: "text", placeholder: "CTO", required: true },
      { id: "vesting_schedule", label: "Vesting Schedule", type: "select", required: true, options: [
        { value: "4y_1y_cliff", label: "4-year vesting, 1-year cliff (standard)" },
        { value: "3y_1y_cliff", label: "3-year vesting, 1-year cliff" },
        { value: "4y_no_cliff", label: "4-year vesting, no cliff" },
      ]},
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a comprehensive Founder Agreement. Include: recitals, equity allocation, vesting schedule with acceleration provisions, roles and responsibilities, IP assignment (all founders assign IP to company), decision-making process, non-compete and non-solicitation, departure terms (voluntary/involuntary), drag-along and tag-along rights, dispute resolution, and governing law. Make it thorough but readable for founders who may not have legal background.`,
  },
  {
    id: "vesting_agreement",
    name: "Vesting Schedule Agreement",
    type: "Vesting Agreement",
    description: "Equity vesting terms for founders and early team members with cliff and acceleration provisions.",
    category: "equity",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "TechStartup Inc.", required: true },
      { id: "recipient_name", label: "Recipient Name", type: "text", placeholder: "Jane Smith", required: true },
      { id: "recipient_role", label: "Role", type: "select", required: true, options: [
        { value: "founder", label: "Founder" },
        { value: "employee", label: "Employee" },
        { value: "advisor", label: "Advisor" },
      ]},
      { id: "total_shares", label: "Total Shares / Equity (%)", type: "text", placeholder: "e.g. 10,000 shares or 5%", required: true },
      { id: "vesting_schedule", label: "Vesting Schedule", type: "select", required: true, options: [
        { value: "4y_1y_cliff", label: "4-year vesting, 1-year cliff" },
        { value: "3y_1y_cliff", label: "3-year vesting, 1-year cliff" },
        { value: "4y_no_cliff", label: "4-year monthly vesting, no cliff" },
        { value: "2y_6m_cliff", label: "2-year vesting, 6-month cliff" },
      ]},
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "start_date", label: "Vesting Start Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a Stock Vesting Agreement. Include: grant details (number of shares, price), vesting schedule (period, cliff, monthly/quarterly vesting after cliff), single-trigger and double-trigger acceleration on change of control, termination provisions (what happens to unvested shares on voluntary/involuntary departure), repurchase rights, transfer restrictions, tax considerations disclaimer, and governing law.`,
  },

  // ─── Employment ───────────────────────────────────────────
  {
    id: "employment_contract",
    name: "Employment Contract",
    type: "Employment Contract",
    description: "Formal employment agreement covering role, compensation, confidentiality, and termination terms.",
    category: "employment",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "TechStartup Inc.", required: true },
      { id: "employee_name", label: "Employee Full Name", type: "text", placeholder: "Jane Smith", required: true },
      { id: "job_title", label: "Job Title", type: "text", placeholder: "e.g. Senior Engineer", required: true },
      { id: "compensation", label: "Annual Salary / Compensation", type: "text", placeholder: "e.g. $120,000/year", required: true },
      { id: "employment_type", label: "Employment Type", type: "select", required: true, options: [
        { value: "full_time", label: "Full-time" },
        { value: "part_time", label: "Part-time" },
      ]},
      { id: "probation_period", label: "Probation Period", type: "select", required: true, options: [
        { value: "none", label: "None" },
        { value: "3_months", label: "3 Months" },
        { value: "6_months", label: "6 Months" },
      ]},
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "start_date", label: "Start Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a professional Employment Contract for a startup. Include: position and duties, reporting structure, compensation and benefits, working hours, probation period (if applicable), confidentiality obligations, IP assignment (all work product belongs to company), non-compete and non-solicitation (reasonable scope), termination provisions (notice periods, grounds for immediate termination), garden leave, and governing law. Balance employer protection with fair employee terms.`,
  },
  {
    id: "contractor_agreement",
    name: "Contractor Agreement",
    type: "Contractor Agreement",
    description: "Independent contractor agreement with IP assignment, confidentiality, and scope of work.",
    category: "employment",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "TechStartup Inc.", required: true },
      { id: "contractor_name", label: "Contractor Name", type: "text", placeholder: "Jane Developer", required: true },
      { id: "scope_of_work", label: "Scope of Work", type: "textarea", placeholder: "Describe the services to be provided", required: true },
      { id: "compensation", label: "Compensation", type: "text", placeholder: "e.g. $5,000/month or $100/hour", required: true },
      { id: "payment_terms", label: "Payment Terms", type: "select", required: true, options: [
        { value: "monthly", label: "Monthly" },
        { value: "biweekly", label: "Bi-weekly" },
        { value: "on_completion", label: "On completion" },
        { value: "milestone", label: "Milestone-based" },
      ]},
      { id: "duration", label: "Contract Duration", type: "select", required: true, options: [
        { value: "3_months", label: "3 Months" },
        { value: "6_months", label: "6 Months" },
        { value: "12_months", label: "12 Months" },
        { value: "ongoing", label: "Ongoing (with notice period)" },
      ]},
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "start_date", label: "Start Date", type: "date", required: true },
    ],
    promptInstructions: `Generate an Independent Contractor Agreement. Include: scope of work, compensation and payment terms, independent contractor status (NOT an employee), IP assignment (all work product assigned to company), confidentiality obligations, term and termination, non-solicitation, representations and warranties, indemnification, and governing law. Clearly establish the independent contractor relationship to avoid misclassification risk.`,
  },
  {
    id: "employee_handbook",
    name: "Employee Handbook",
    type: "Employee Handbook",
    description: "Internal policies covering conduct, leave, benefits, grievances, and workplace expectations.",
    category: "employment",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "TechStartup Inc.", required: true },
      { id: "jurisdiction", label: "Primary Jurisdiction", type: "select", required: true, options: jurisdictionOptions },
      { id: "team_size", label: "Current Team Size", type: "select", required: true, options: [
        { value: "1_10", label: "1-10 employees" },
        { value: "11_25", label: "11-25 employees" },
        { value: "26_50", label: "26-50 employees" },
        { value: "50_plus", label: "50+ employees" },
      ]},
      { id: "remote_policy", label: "Work Arrangement", type: "select", required: true, options: [
        { value: "office", label: "Office-based" },
        { value: "remote", label: "Fully remote" },
        { value: "hybrid", label: "Hybrid" },
      ]},
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a startup Employee Handbook. Include: welcome and company values, employment basics (at-will/contract, equal opportunity), code of conduct, work arrangements and hours, leave policies (annual, sick, parental), compensation and benefits overview, performance reviews, confidentiality and data protection, IT and acceptable use policy, anti-harassment and discrimination, grievance procedure, disciplinary process, health and safety, and amendments. Keep it professional but approachable for a startup culture.`,
  },

  // ─── IP ───────────────────────────────────────────────────
  {
    id: "ip_assignment",
    name: "IP Assignment Agreement",
    type: "IP Assignment",
    description: "Assign intellectual property rights from founders or contributors to the company.",
    category: "ip",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "TechStartup Inc.", required: true },
      { id: "assignor_name", label: "Assignor Name (person assigning IP)", type: "text", placeholder: "Jane Smith", required: true },
      { id: "assignor_role", label: "Assignor's Relationship to Company", type: "select", required: true, options: [
        { value: "founder", label: "Founder" },
        { value: "employee", label: "Employee" },
        { value: "contractor", label: "Contractor" },
        { value: "advisor", label: "Advisor" },
      ]},
      { id: "ip_description", label: "Description of IP Being Assigned", type: "textarea", placeholder: "e.g. All source code, designs, and documentation for the Orion platform", required: true },
      { id: "consideration", label: "Consideration (what assignor receives)", type: "text", placeholder: "e.g. Equity in the company / $1 / Employment", required: true },
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate an Intellectual Property Assignment Agreement. Include: definitions (IP, work product, prior inventions), assignment of all IP and work product to the company (past and future during engagement), moral rights waiver where applicable, representations that assignor has right to assign, prior inventions schedule (exclusions), assistance with IP registration, and governing law. This must be comprehensive enough to withstand investor due diligence scrutiny.`,
  },

  // ─── Data & Privacy ───────────────────────────────────────
  {
    id: "privacy_policy",
    name: "Privacy Policy",
    type: "Privacy Policy",
    description: "Policy describing how you collect, use, store, and protect user data.",
    category: "data_privacy",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "Your Company Ltd", required: true },
      { id: "product_name", label: "Product / Website Name", type: "text", placeholder: "e.g. Orion Platform", required: true },
      { id: "data_types", label: "Types of Data Collected", type: "textarea", placeholder: "e.g. Name, email, usage analytics, payment info", required: true },
      { id: "jurisdiction", label: "Primary Jurisdiction", type: "select", required: true, options: jurisdictionOptions },
      { id: "compliance_frameworks", label: "Compliance Requirements", type: "select", required: true, options: [
        { value: "gdpr", label: "GDPR (EU/UK)" },
        { value: "ccpa", label: "CCPA (California)" },
        { value: "ndpr", label: "NDPR (Nigeria)" },
        { value: "general", label: "General best practices" },
      ]},
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a comprehensive Privacy Policy. Include: information collected (personal data, usage data, cookies), how information is used, legal basis for processing (where applicable), data sharing and third parties, data retention, user rights (access, correction, deletion, portability), security measures, international transfers, children's privacy, changes to policy, and contact information. Comply with the specified regulatory framework. Make it clear and transparent.`,
  },
  {
    id: "data_processing_agreement",
    name: "Data Processing Agreement",
    type: "DPA",
    description: "Agreement with third-party services that process your user data, required for GDPR and other frameworks.",
    category: "data_privacy",
    fields: [
      { id: "controller_name", label: "Data Controller (Your Company)", type: "text", placeholder: "Your Company Ltd", required: true },
      { id: "processor_name", label: "Data Processor (Service Provider)", type: "text", placeholder: "e.g. AWS / Stripe / SendGrid", required: true },
      { id: "processing_purpose", label: "Purpose of Processing", type: "textarea", placeholder: "e.g. Cloud hosting of user data, payment processing", required: true },
      { id: "data_types", label: "Categories of Personal Data", type: "textarea", placeholder: "e.g. Name, email, IP address, payment details", required: true },
      { id: "jurisdiction", label: "Governing Law", type: "select", required: true, options: jurisdictionOptions },
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a Data Processing Agreement (DPA) compliant with GDPR. Include: definitions, subject matter and duration, nature and purpose of processing, categories of data subjects and personal data, obligations of the processor (security measures, sub-processors, data breach notification, assistance with data subject rights, audit rights), obligations of the controller, international data transfers (Standard Contractual Clauses reference), termination and data return/deletion, and liability.`,
  },
  {
    id: "cookie_policy",
    name: "Cookie / Tracking Policy",
    type: "Cookie Policy",
    description: "Disclosure of cookies, tracking technologies, and analytics used on your website or app.",
    category: "data_privacy",
    fields: [
      { id: "company_name", label: "Company Name", type: "text", placeholder: "Your Company Ltd", required: true },
      { id: "website_url", label: "Website URL", type: "text", placeholder: "https://yourcompany.com", required: true },
      { id: "analytics_tools", label: "Analytics / Tracking Tools Used", type: "textarea", placeholder: "e.g. Google Analytics, Mixpanel, Hotjar", required: true },
      { id: "jurisdiction", label: "Primary Jurisdiction", type: "select", required: true, options: jurisdictionOptions },
      { id: "effective_date", label: "Effective Date", type: "date", required: true },
    ],
    promptInstructions: `Generate a Cookie / Tracking Policy. Include: what cookies are, types of cookies used (strictly necessary, performance, functionality, targeting/advertising), specific cookies and their purposes (table format), third-party cookies, how to manage/disable cookies (browser settings, opt-out links), consent mechanism description, impact of disabling cookies, updates to the policy, and contact information. Comply with the jurisdiction's requirements.`,
  },
];

export function getTemplate(id: string) {
  return templates.find((t) => t.id === id);
}

/** Map issue titles/domains to template IDs for recommendation matching */
const issueToTemplateMap: Record<string, string> = {
  bylaws: "bylaws",
  "articles of association": "bylaws",
  "employment contract": "employment_contract",
  "contractor agreement": "contractor_agreement",
  "contractor / freelancer": "contractor_agreement",
  nda: "nda",
  "non-disclosure": "nda",
  "founder agreement": "founder_agreement",
  "shareholder agreement": "founder_agreement",
  "ip assignment": "ip_assignment",
  "intellectual property": "ip_assignment",
  "terms of service": "terms_of_service",
  "customer agreement": "terms_of_service",
  "privacy policy": "privacy_policy",
  "data processing": "data_processing_agreement",
  dpa: "data_processing_agreement",
  "cookie policy": "cookie_policy",
  "tracking policy": "cookie_policy",
  "employee handbook": "employee_handbook",
  "vesting": "vesting_agreement",
};

/**
 * Given an issue title from the AI assessment, find a matching template.
 * Uses fuzzy keyword matching against the issue title.
 */
export function matchIssueToTemplate(issueTitle: string): DocumentTemplate | null {
  const lower = issueTitle.toLowerCase();
  for (const [keyword, templateId] of Object.entries(issueToTemplateMap)) {
    if (lower.includes(keyword)) {
      return getTemplate(templateId) || null;
    }
  }
  return null;
}
