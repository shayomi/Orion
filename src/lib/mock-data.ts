export const mockUser = {
  id: "usr_01",
  name: "Alex Johnson",
  email: "alex@techstartup.io",
  avatar: null,
}

export const mockOrganization = {
  id: "org_01",
  name: "TechStartup Inc.",
  stage: "pre-seed",
  structure: "Delaware C-Corp",
  jurisdiction: "Delaware, USA",
  fundingStatus: "Bootstrapped",
  teamSize: 4,
  incorporatedAt: null,
  riskScore: 72,
}

export const mockWorkflows = [
  {
    id: "wf_01",
    title: "Incorporation Flow",
    description: "Set up your Delaware C-Corp with all required documents",
    status: "in_progress",
    progress: 60,
    steps: [
      { id: 1, title: "Choose jurisdiction", status: "completed" },
      { id: 2, title: "Select entity type", status: "completed" },
      { id: 3, title: "Define founder equity split", status: "completed" },
      { id: 4, title: "Generate incorporation docs", status: "in_progress" },
      { id: 5, title: "File with state", status: "pending" },
      { id: 6, title: "EIN registration", status: "pending" },
    ],
  },
  {
    id: "wf_02",
    title: "Founder Agreements",
    description: "Co-founder agreements, IP assignments, and vesting schedules",
    status: "pending",
    progress: 0,
    steps: [
      { id: 1, title: "Define roles & responsibilities", status: "pending" },
      { id: 2, title: "Set equity split", status: "pending" },
      { id: 3, title: "Configure vesting schedule", status: "pending" },
      { id: 4, title: "Generate agreements", status: "pending" },
      { id: 5, title: "Sign & execute", status: "pending" },
    ],
  },
  {
    id: "wf_03",
    title: "Seed Round Prep",
    description: "Term sheets, SAFEs, and investor documentation",
    status: "locked",
    progress: 0,
    steps: [],
  },
]

export const mockDocuments = [
  {
    id: "doc_01",
    name: "Certificate of Incorporation",
    type: "Incorporation",
    status: "draft",
    createdAt: "2024-01-15",
    size: "124 KB",
  },
  {
    id: "doc_02",
    name: "Bylaws",
    type: "Incorporation",
    status: "draft",
    createdAt: "2024-01-15",
    size: "89 KB",
  },
  {
    id: "doc_03",
    name: "83(b) Election Template",
    type: "Tax",
    status: "ready",
    createdAt: "2024-01-12",
    size: "45 KB",
  },
  {
    id: "doc_04",
    name: "NDA Template",
    type: "General",
    status: "ready",
    createdAt: "2024-01-10",
    size: "32 KB",
  },
  {
    id: "doc_05",
    name: "Advisor Agreement",
    type: "Equity",
    status: "pending_review",
    createdAt: "2024-01-08",
    size: "67 KB",
  },
]

export const mockAlerts = [
  {
    id: "alert_01",
    type: "warning",
    title: "Founder agreement missing",
    description: "You have co-founders but no formal equity agreement on file.",
    action: "Start Founder Agreements",
    workflow: "wf_02",
  },
  {
    id: "alert_02",
    type: "info",
    title: "83(b) election window",
    description: "File your 83(b) election within 30 days of incorporation.",
    action: "Learn more",
    workflow: null,
  },
  {
    id: "alert_03",
    type: "success",
    title: "Delaware C-Corp structure confirmed",
    description: "Your entity type is optimal for VC fundraising.",
    action: null,
    workflow: null,
  },
]

export const mockServices = [
  {
    id: "svc_01",
    name: "Launch",
    price: 999,
    description: "Incorporate and structure your company properly",
    features: [
      "Incorporation in UK, US, or Nigeria (incl. Free Zones)",
      "Share structure & governance setup",
      "Founder agreements (up to 4 founders)",
      "IP assignment agreements",
      "Vesting schedule configuration",
      "AI co-pilot access",
    ],
    popular: false,
    cta: "Get Started",
  },
  {
    id: "svc_02",
    name: "Fund",
    price: 2499,
    description: "Structure your raise and close your round",
    features: [
      "Everything in Launch",
      "SAFE & convertible note drafting",
      "Deal structuring & terms advice",
      "Term sheet review & negotiation support",
      "Investor due diligence preparation",
      "Cap table modeling",
    ],
    popular: true,
    cta: "Get Started",
  },
  {
    id: "svc_03",
    name: "Scale",
    price: 4999,
    description: "Full legal operations as your company grows",
    features: [
      "Everything in Fund",
      "Ongoing contracts & compliance support",
      "Regulatory guidance across jurisdictions",
      "Employee & option pool documentation",
      "Board resolutions & governance",
      "Priority legal counsel (10 hrs/mo)",
    ],
    popular: false,
    cta: "Talk to Us",
  },
]

export const mockChatHistory = [
  {
    id: "msg_01",
    role: "assistant",
    content:
      "Hello Alex! I'm Orion, your legal co-pilot. I can see you're incorporating TechStartup Inc. as a Delaware C-Corp — great choice for a VC-backed startup. What can I help you with today?",
    timestamp: "2024-01-15T10:00:00Z",
  },
  {
    id: "msg_02",
    role: "user",
    content: "Do I need a founder agreement even if I trust my co-founder?",
    timestamp: "2024-01-15T10:01:00Z",
  },
  {
    id: "msg_03",
    role: "assistant",
    content:
      "Absolutely — and this is one of the most important things I need you to hear: **trust is not a legal document**.\n\nHere's why a founder agreement is critical regardless of trust:\n\n**1. Vesting schedules protect everyone**\nIf a co-founder leaves in year 1, unvested equity returns to the company. Without this, a departed founder could own 30-40% while contributing nothing.\n\n**2. It defines roles clearly**\nWho's CEO? Who has final say on product? These decisions need to be made *before* conflict arises.\n\n**3. IP assignment**\nWithout a formal IP assignment, your co-founder technically owns the code they wrote. Investors will catch this in due diligence.\n\n**My recommendation:** Start the Founder Agreements workflow today. It takes about 20 minutes and could save your company later.",
    timestamp: "2024-01-15T10:01:30Z",
  },
]
