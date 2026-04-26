export interface WorkflowStep {
  id: number;
  title: string;
  status: "completed" | "in_progress" | "pending";
}

export interface Workflow {
  id: string;
  title: string;
  description: string;
  status: "in_progress" | "pending" | "locked";
  progress: number;
  steps: WorkflowStep[];
}

/**
 * Placeholder workflows — these are illustrative previews shown until
 * the real workflow engine is built. They are not user-generated data.
 */
export const PLACEHOLDER_WORKFLOWS: Workflow[] = [
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
];
