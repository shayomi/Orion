import "dotenv/config";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import {
  users,
  assessmentTemplates,
  assessmentTemplateSections,
  assessmentTemplateQuestions,
} from "./schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

// ─── Section + question data ────────────────────────────

interface QuestionDef {
  key: string;
  prompt: string;
  description?: string;
  inputType: string;
  options?: unknown;
  domain: string;
  required: boolean;
  weight: number;
}

interface SectionDef {
  title: string;
  description: string;
  domain: string;
  questions: QuestionDef[];
}

const TEMPLATE_NAME = "Legal Health Check";
const TEMPLATE_DESCRIPTION =
  "Comprehensive legal due-diligence assessment covering formation, regulatory compliance, tax, contracts, IP, and litigation.";

const sections: SectionDef[] = [
  // ── Section 1: Formation Details ────────────────────────
  {
    title: "Formation Details",
    description:
      "Information and documents required about your company formation, ownership, and governance structure.",
    domain: "formation",
    questions: [
      {
        key: "q1_jurisdictions",
        prompt:
          "What jurisdictions is your company currently incorporated or registered to do business?",
        description:
          "Please attach links to all incorporation documents, including certificates of incorporation, memorandum, operating documents, bylaws, status reports etc for each jurisdiction.",
        inputType: "multi_select",
        options: {
          choices: [
            "Nigeria",
            "United States (e.g., Delaware)",
            "Other",
          ],
          allowOtherText: true,
        },
        domain: "formation",
        required: true,
        weight: 3,
      },
      {
        key: "q2_subsidiaries",
        prompt:
          "Does your company have any subsidiaries or affiliated legal entities?",
        description: "If yes, please provide a list of other jurisdictions.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "formation",
        required: true,
        weight: 2,
      },
      {
        key: "q3_shareholders",
        prompt:
          "List of shareholders/members and their percentage holdings of each of your incorporated entities.",
        description:
          "Please attach documents evidencing the issuance of the shares to the shareholders.",
        inputType: "textarea",
        domain: "formation",
        required: true,
        weight: 3,
      },
      {
        key: "q4_vesting",
        prompt:
          "Do you have any vesting schedules for founders/key employees?",
        description:
          "If yes, provide copies of vesting agreements or schedules. If no, explain how shares or options have been issued.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "formation",
        required: true,
        weight: 2,
      },
      {
        key: "q5_ownership_changes",
        prompt:
          "Have you made changes to your ownership structure in the past 12–24 months?",
        description:
          "If yes, provide description of changes including share transfer agreements, board/shareholders resolutions.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "formation",
        required: true,
        weight: 2,
      },
      {
        key: "q6_cap_table",
        prompt: "Do you have a current Cap Table for your company?",
        description:
          "If yes, please provide the most recent version (Excel or PDF) or a secure link.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "formation",
        required: true,
        weight: 3,
      },
      {
        key: "q7_founders_agreement",
        prompt:
          "Do you have a signed Founders Agreement, Shareholders Agreement or Share Subscription Agreements?",
        description:
          "If yes, upload or provide access to the signed agreement including any amendments. If no, explain how you manage the business relationship.",
        inputType: "select",
        options: {
          choices: [
            "Yes",
            "No",
            "Not applicable (solo founder)",
          ],
        },
        domain: "formation",
        required: true,
        weight: 3,
      },
      {
        key: "q8_board_structure",
        prompt: "Does your company have a formal board structure?",
        description:
          "If yes, specify the number of directors for each jurisdiction and their roles (executive, non-executive, independent).",
        inputType: "select",
        options: {
          choices: ["Yes", "No", "In progress/being set up"],
        },
        domain: "formation",
        required: true,
        weight: 2,
      },
      {
        key: "q9_esop",
        prompt:
          "Does the Company have an Employee Stock Option Plan (ESOP) in place?",
        description: "If yes, please provide supporting documents.",
        inputType: "select",
        options: {
          choices: [
            "Yes",
            "No",
            "In development/under consideration",
          ],
        },
        domain: "formation",
        required: true,
        weight: 2,
      },
      {
        key: "q10_esop_allocated",
        prompt:
          "Has the ESOP been allocated to employees (i.e., have option grants been issued)?",
        description:
          "If yes, provide supporting documents including number of employees granted, % of equity pool, vesting schedules, cliffs, ESOP plan, grant agreements, board/shareholder approval, 409A valuation.",
        inputType: "select",
        options: {
          choices: ["Yes", "No", "Partially"],
          showIf: { questionKey: "q9_esop", equals: "Yes" },
        },
        domain: "formation",
        required: false,
        weight: 2,
      },
      {
        key: "q11_legal_counsel",
        prompt:
          "Do you currently have in-house or external legal counsel?",
        description: "If yes, please specify which and details if applicable.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "formation",
        required: true,
        weight: 1,
      },
    ],
  },

  // ── Section 2: Regulatory and Compliance ────────────────
  {
    title: "Regulatory and Compliance",
    description:
      "Evaluates adherence to regulatory requirements — licenses, complaints, fines, and regulatory correspondences.",
    domain: "regulatory",
    questions: [
      {
        key: "q12_product_led",
        prompt:
          "Is your company product-led? (i.e., is your primary revenue driven by a scalable product such as software, an app, platform, marketplace, fintech solution, or physical product?)",
        description:
          "If yes, briefly describe your business model and whether your product is core to your revenue strategy.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "regulatory",
        required: true,
        weight: 1,
      },
      {
        key: "q13_subject_to_regulation",
        prompt:
          "Is the company or any of its products or services subject to regulation by any authority?",
        inputType: "select",
        options: { choices: ["Yes", "No", "Not sure"] },
        domain: "regulatory",
        required: true,
        weight: 3,
      },
      {
        key: "q14_regulators",
        prompt:
          "Please specify the regulator(s) involved and the applicable laws or frameworks.",
        inputType: "multi_select",
        options: {
          choices: [
            "CBN",
            "NAFDAC",
            "NCC",
            "SEC",
            "NDPC",
            "FRC",
            "EFCC/SCUML",
            "Others",
          ],
          allowOtherText: true,
          showIf: { questionKey: "q13_subject_to_regulation", equals: "Yes" },
        },
        domain: "regulatory",
        required: false,
        weight: 3,
      },
      {
        key: "q15_business_licenses",
        prompt: "Do you currently hold business or operational licenses?",
        description: "If yes, please provide copies of your license.",
        inputType: "select",
        options: {
          choices: [
            "Yes",
            "No",
            "In progress",
            "Not sure",
            "Not Applicable",
          ],
        },
        domain: "regulatory",
        required: true,
        weight: 3,
      },
      {
        key: "q16_international_operations",
        prompt:
          "Does the company currently operate in any countries outside its primary jurisdiction(s) of incorporation?",
        description:
          "If yes, list the international jurisdictions including any licenses.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "regulatory",
        required: true,
        weight: 2,
      },
      {
        key: "q17_personal_data",
        prompt:
          "Does your company collect, process, or store personal data?",
        description:
          "If yes, describe the types of personal data you collect, process, or store.",
        inputType: "select",
        options: { choices: ["Yes", "No", "Not sure"] },
        domain: "regulatory",
        required: true,
        weight: 3,
      },
      {
        key: "q18_ndpc_registered",
        prompt:
          "Are you registered with the Nigeria Data Protection Commission (NDPC)?",
        description:
          "If yes, please upload your NDPC registration certificate or confirmation document.",
        inputType: "select",
        options: {
          choices: ["Yes", "No", "Registration in progress"],
          showIf: { questionKey: "q17_personal_data", equals: "Yes" },
        },
        domain: "regulatory",
        required: false,
        weight: 3,
      },
      {
        key: "q19_corporate_filings",
        prompt:
          "Are all required corporate filings and returns up to date in each jurisdiction of incorporation?",
        description: "Please provide evidence of up-to-date filings where required.",
        inputType: "select",
        options: { choices: ["Yes", "No", "Not sure"] },
        domain: "regulatory",
        required: true,
        weight: 3,
      },
      {
        key: "q20_pending_filings",
        prompt: "Please explain which filings are pending and why.",
        inputType: "textarea",
        options: {
          showIf: { questionKey: "q19_corporate_filings", notEquals: "Yes" },
        },
        domain: "regulatory",
        required: false,
        weight: 2,
      },
      {
        key: "q21_regulatory_notices",
        prompt:
          "Has the company received any notices, inquiries, penalties, or warnings from any regulatory authority in the past 24 months for regulatory non-compliance?",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "regulatory",
        required: true,
        weight: 3,
      },
      {
        key: "q22_regulatory_details",
        prompt: "Please provide details and relevant correspondence.",
        inputType: "textarea",
        options: {
          showIf: { questionKey: "q21_regulatory_notices", equals: "Yes" },
        },
        domain: "regulatory",
        required: false,
        weight: 3,
      },
      {
        key: "q23_compliance_consultants",
        prompt:
          "Who are the consultants, third-party services, or law firms you use for your compliance functions and reporting obligations?",
        inputType: "textarea",
        domain: "regulatory",
        required: false,
        weight: 1,
      },
    ],
  },

  // ── Section 3: Tax and Employee Statutory Filings ───────
  {
    title: "Tax and Employee Statutory Filings",
    description:
      "Evidence of tax compliance, payments, and employee statutory obligations.",
    domain: "tax",
    questions: [
      {
        key: "q24_tax_returns_ng",
        prompt:
          "Has your company filed all required tax returns in Nigeria in the past 2 years? Please indicate as applicable.",
        description:
          "Provide details and evidence of filings including tax clearance certificate. Also indicate if you are on Tax Promax.",
        inputType: "multi_select",
        options: {
          choices: [
            "No",
            "Companies Income Tax",
            "Value Added Tax",
            "Withholding Tax",
            "Education Tax",
            "PAYE",
            "Direct Assessment",
            "Others",
          ],
          allowOtherText: true,
          subQuestions: [
            {
              key: "q24b_tax_promax",
              prompt: "Are you on Tax Promax (if Nigeria incorporated)?",
              choices: ["Yes", "No"],
            },
          ],
        },
        domain: "tax",
        required: true,
        weight: 3,
      },
      {
        key: "q25_statutory_compliance",
        prompt:
          "Does your company comply with any of the following?",
        inputType: "multi_select",
        options: {
          choices: [
            "NSITF",
            "NHF",
            "ITF",
            "National Minimum Wage",
            "HMO",
            "Group Life Insurance",
            "I own my building and comply with Occupiers' Liability Insurance",
            "I own my building, but I do not comply with Occupiers' Liability Insurance",
            "I do not own my building",
          ],
        },
        domain: "tax",
        required: true,
        weight: 2,
      },
      {
        key: "q26_employee_count",
        prompt: "How many employees does your company currently have?",
        inputType: "select",
        options: { choices: ["0-12", "13 and above"] },
        domain: "tax",
        required: true,
        weight: 2,
      },
      {
        key: "q27_pencom",
        prompt:
          "Has your company registered with PENCOM and do you currently remit pension contributions for your employees?",
        description:
          "Please upload your PENCOM compliance certificate or any proof of registration/remittance if available.",
        inputType: "multi_select",
        options: {
          choices: [
            "Yes, registered and remitting for all eligible employees",
            "Yes, registered but not currently remitting",
            "Registration is in progress",
            "No, not registered and do not remit",
            "Not sure",
          ],
        },
        domain: "tax",
        required: true,
        weight: 2,
      },
      {
        key: "q28_tax_holiday",
        prompt:
          "Are you currently entitled to any tax holiday or government incentive in any of the jurisdictions where you operate?",
        description:
          "If yes, provide details of the incentive including program name, duration, and granting authority.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "tax",
        required: true,
        weight: 1,
      },
      {
        key: "q29_us_entity",
        prompt: "Are you registered as a U.S. entity (e.g., in Delaware)?",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "tax",
        required: true,
        weight: 2,
      },
      {
        key: "q30_us_tax_returns",
        prompt:
          "Has your company filed the required U.S. federal tax returns?",
        description: "Please attach all supporting documents.",
        inputType: "multi_select",
        options: {
          choices: [
            "Form 1120 (U.S. Corporation Income Tax Return – C-Corp)",
            "Form 1065 (Return of Partnership Income – for LLCs)",
            "Form 5472 (Foreign-owned U.S. entity reporting)",
            "Form 5471 (U.S. owners of foreign corporations)",
            "Form 1099 (Independent contractor payments – LLCs)",
            "Form 7004 (6-month extension to filing deadline)",
            "Franchise Tax",
            "Beneficial Ownership Information (FinCEN)",
            "No",
          ],
          allowOtherText: true,
          showIf: { questionKey: "q29_us_entity", equals: "Yes" },
        },
        domain: "tax",
        required: false,
        weight: 3,
      },
    ],
  },

  // ── Section 4: Contracts and Fundraising ────────────────
  {
    title: "Contracts and Fundraising",
    description:
      "Examines material contracts, fundraising efforts, and previous rounds raised by the company.",
    domain: "contracts",
    questions: [
      {
        key: "q31_major_contracts",
        prompt:
          "Does the company have any major signed contracts with clients, vendors, investors, or partners?",
        description: "If yes, please provide details of the key contracts.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "contracts",
        required: true,
        weight: 2,
      },
      {
        key: "q32_standard_agreements",
        prompt:
          "Do you use standard agreements or templates for your customers and vendors?",
        description:
          "If yes, upload or link to your standard agreements (e.g., service agreement, vendor contract, SaaS terms, NDAs).",
        inputType: "multi_select",
        options: {
          choices: [
            "Yes, for both customers and vendors",
            "Yes, but only for customers",
            "Yes, but only for vendors",
            "No, we do not currently use standard agreements",
          ],
        },
        domain: "contracts",
        required: true,
        weight: 2,
      },
      {
        key: "q33_customer_vendor_terms",
        prompt:
          "What documents or terms do your customers/vendors typically sign or agree to (if any)?",
        inputType: "textarea",
        options: {
          showIf: {
            questionKey: "q32_standard_agreements",
            includes: "No, we do not currently use standard agreements",
          },
        },
        domain: "contracts",
        required: false,
        weight: 1,
      },
      {
        key: "q34_convertible_instruments",
        prompt:
          "Are there any convertible instruments (e.g., SAFEs, convertible notes/debt, equity financing)?",
        description:
          "If yes, provide access to all executed and supporting investment documents.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "contracts",
        required: true,
        weight: 3,
      },
      {
        key: "q35_equity_financing",
        prompt: "Have you previously raised any equity financing rounds?",
        description:
          "If yes, provide access to all executed and supporting investment documents including Form D, shareholding agreement, share purchase agreement.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "contracts",
        required: true,
        weight: 3,
      },
      {
        key: "q36_investor_rights",
        prompt:
          "Do any existing investors have the following rights?",
        description:
          "Upload/share any shareholder agreements, SAFE/convertible agreements, or investor rights documents.",
        inputType: "multi_select",
        options: {
          choices: [
            "Most Favored Nation (MFN) rights",
            "Pro rata rights",
            "Board seats or observer rights",
            "Information rights",
            "Right of first refusal (ROFR)",
            "None of the above",
            "Not sure",
          ],
        },
        domain: "contracts",
        required: true,
        weight: 2,
      },
      {
        key: "q37_ma_restructuring",
        prompt:
          "Have there been any of the following in the past 24 months (or are any planned)?",
        description:
          "Provide details of each transaction, counterparties, status, and upload relevant documents.",
        inputType: "multi_select",
        options: {
          choices: [
            "Mergers or acquisitions (M&A)",
            "Asset sales or business unit divestitures",
            "Internal restructurings",
            "None",
            "Planned",
            "Others",
          ],
          allowOtherText: true,
        },
        domain: "contracts",
        required: true,
        weight: 3,
      },
      {
        key: "q38_debt_obligations",
        prompt:
          "Does the company have any outstanding debt obligations (e.g., loans, credit lines, liens, convertible debt)?",
        description:
          "If yes, provide details including lender, amount, interest, maturity, and current status.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "contracts",
        required: true,
        weight: 3,
      },
      {
        key: "q39_debt_compliance",
        prompt:
          "Are you currently in compliance with all covenants or conditions in your loan or debt agreements?",
        description: "If no, please provide details of non-compliance.",
        inputType: "select",
        options: {
          choices: ["Yes", "No"],
          showIf: { questionKey: "q38_debt_obligations", equals: "Yes" },
        },
        domain: "contracts",
        required: false,
        weight: 3,
      },
      {
        key: "q40_asset_pledges",
        prompt:
          "Has the company pledged any of its assets as collateral for existing debt or financing arrangements? Are there any personal guarantees (e.g., by founders or directors) associated with company debts?",
        description:
          "If yes, provide details. Also indicate if pledges have been registered with the Corporate Affairs Commission or any other body.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "contracts",
        required: true,
        weight: 2,
      },
      {
        key: "q41_debt_control_provisions",
        prompt:
          "Do any of your debt agreements contain change-of-control provisions or restrictions on the following?",
        inputType: "multi_select",
        options: {
          choices: [
            "Obtaining additional debt",
            "Making changes to company ownership or control (change of control clauses)",
            "Paying dividends or making distributions to shareholders",
            "Selling, leasing, or transferring significant assets",
            "None of the above",
            "Other",
          ],
          allowOtherText: true,
        },
        domain: "contracts",
        required: true,
        weight: 2,
      },
      {
        key: "q42_related_party_contracts",
        prompt:
          "Does the company have any material contracts or ongoing business relationships with related parties?",
        description:
          "Specify which agreement and upload any related contracts or documentation.",
        inputType: "multi_select",
        options: {
          choices: [
            "Entities owned or controlled by shareholders",
            "Companies where directors or their family members have significant interests",
            "Businesses owned by close relatives of key management personnel",
            "None of the above",
            "Others",
          ],
          allowOtherText: true,
        },
        domain: "contracts",
        required: true,
        weight: 2,
      },
      {
        key: "q43_corporate_policies",
        prompt:
          "Do you currently have any of the following corporate policies in place?",
        description: "Please upload copies of any selected policies if available.",
        inputType: "multi_select",
        options: {
          choices: [
            "Code of conduct/ethics",
            "Whistleblower Policy",
            "Know Your Customer (KYC) Policy",
            "Anti-Bribery & Corruption Policy",
            "Anti-Money Laundering (AML) Policy",
            "Conflict of Interest Policy",
            "Data Protection & Privacy Policy",
            "Employee handbook",
            "Disciplinary Policy/Framework",
            "None of the above",
            "Others",
          ],
          allowOtherText: true,
        },
        domain: "contracts",
        required: true,
        weight: 2,
      },
    ],
  },

  // ── Section 5: IP, IT and Data Protection ───────────────
  {
    title: "Intellectual Property, Information Technology and Data Protection",
    description:
      "Evaluates IP rights, technology agreements, data protection measures, and compliance with data protection regulations.",
    domain: "ip",
    questions: [
      {
        key: "q44_ip_rights",
        prompt:
          "Has the company registered or applied for any intellectual property rights?",
        description:
          "If yes, select all that apply and upload registration certificates or application documents.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "ip",
        required: true,
        weight: 3,
      },
      {
        key: "q44b_ip_types",
        prompt: "Which types of IP rights have been registered or applied for?",
        inputType: "multi_select",
        options: {
          choices: [
            "Trademarks",
            "Copyrights",
            "Patents",
            "Industrial designs",
            "Other",
          ],
          allowOtherText: true,
          showIf: { questionKey: "q44_ip_rights", equals: "Yes" },
        },
        domain: "ip",
        required: false,
        weight: 3,
      },
      {
        key: "q44c_ip_assignment",
        prompt:
          "Do the founders, employees, or contractors assign IP created during their work to the company?",
        description:
          "If yes, upload/share link to IP assignment agreements.",
        inputType: "select",
        options: {
          choices: ["Yes, we have IP assignment clauses or agreements", "No", "Not sure"],
        },
        domain: "ip",
        required: true,
        weight: 3,
      },
      {
        key: "q45_third_party_tech",
        prompt:
          "Does the company use any third-party technology platforms, APIs, or software tools critical to its operations?",
        description:
          "If yes, list key tools and platforms used (e.g., AWS, Stripe, Firebase, licensed SDKs).",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "ip",
        required: true,
        weight: 2,
      },
      {
        key: "q46_software_licenses",
        prompt:
          "Do you have contracts or licenses in place for all commercial software or technology used?",
        inputType: "select",
        options: { choices: ["Yes", "No", "Some", "Not sure"] },
        domain: "ip",
        required: true,
        weight: 2,
      },
      {
        key: "q47_ip_proceedings",
        prompt:
          "Are there any actual, threatened, or potential legal proceedings involving the company's intellectual property rights?",
        description:
          "Including infringement, ownership disputes, or indemnities from other parties. If yes, provide details.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "ip",
        required: true,
        weight: 3,
      },
      {
        key: "q48_data_protection",
        prompt:
          "How does the company protect private or confidential information and user/customer data?",
        description:
          "Describe any data protection practices, access controls, encryption, confidentiality clauses, or policies.",
        inputType: "textarea",
        domain: "ip",
        required: true,
        weight: 2,
      },
    ],
  },

  // ── Section 6: Material Litigation and Arbitration ──────
  {
    title: "Material Litigation and Arbitration",
    description:
      "Details of legal disputes that may pose significant risks to operations and reputation, including ongoing or potential litigation, arbitration, and settlements.",
    domain: "litigation",
    questions: [
      {
        key: "q49_current_litigation",
        prompt:
          "Are there any ongoing, threatened, or pending material arbitration, litigation, administrative or regulatory proceedings, investigations, or hearings involving the Company?",
        description:
          "Including governmental actions, customer or employee complaints. If yes, please provide details.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "litigation",
        required: true,
        weight: 3,
      },
      {
        key: "q50_prior_litigation",
        prompt:
          "Has the company been subject to any prior litigation, settlements, judgments, arbitral awards, or government investigations that may have impacted or still affect its operations, assets, or reputation?",
        description:
          "If yes, summarize the matters and indicate whether any court orders, settlements, or rulings remain in effect.",
        inputType: "select",
        options: { choices: ["Yes", "No"] },
        domain: "litigation",
        required: true,
        weight: 3,
      },
    ],
  },
];

// ─── Seed runner ────────────────────────────────────────

async function seed() {
  console.log("Seeding Legal Health Check template...\n");

  // Find admin user for createdByUserId
  const [admin] = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, "admin"))
    .limit(1);

  if (!admin) {
    console.error(
      "No admin user found. Create one at /admin/create first, then run this seed."
    );
    process.exit(1);
  }

  // Check if template already exists
  const [existing] = await db
    .select({ id: assessmentTemplates.id })
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.name, TEMPLATE_NAME))
    .limit(1);

  if (existing) {
    console.log(
      `Template "${TEMPLATE_NAME}" already exists (id: ${existing.id}). Skipping seed.`
    );
    process.exit(0);
  }

  // Create template
  const [template] = await db
    .insert(assessmentTemplates)
    .values({
      name: TEMPLATE_NAME,
      description: TEMPLATE_DESCRIPTION,
      status: "published",
      version: 1,
      publishedAt: new Date(),
      createdByUserId: admin.id,
    })
    .returning({ id: assessmentTemplates.id });

  console.log(`Created template: ${template.id}`);

  // Create sections + questions
  let totalQuestions = 0;

  for (let si = 0; si < sections.length; si++) {
    const sec = sections[si];

    const [section] = await db
      .insert(assessmentTemplateSections)
      .values({
        templateId: template.id,
        title: sec.title,
        description: sec.description,
        orderIndex: si,
      })
      .returning({ id: assessmentTemplateSections.id });

    console.log(`  Section ${si + 1}: ${sec.title} (${sec.questions.length} questions)`);

    for (let qi = 0; qi < sec.questions.length; qi++) {
      const q = sec.questions[qi];

      await db.insert(assessmentTemplateQuestions).values({
        sectionId: section.id,
        questionKey: q.key,
        prompt: q.prompt,
        description: q.description ?? null,
        inputType: q.inputType,
        options: q.options ?? null,
        domain: q.domain,
        required: q.required,
        weight: q.weight,
        orderIndex: qi,
      });

      totalQuestions++;
    }
  }

  console.log(
    `\nDone! Seeded ${sections.length} sections with ${totalQuestions} questions.`
  );
  console.log(`Template ID: ${template.id}`);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
