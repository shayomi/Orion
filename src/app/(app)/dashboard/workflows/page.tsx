import { Topbar } from "@/components/layout/topbar";
import WorkflowList from "@/components/dashboard/workflows/workflow-list";

export default function WorkflowsPage() {
  return (
    <div>
      <Topbar title="Workflows" subtitle="Your legal journey, step by step" />
      <div className="p-6">
        <WorkflowList />
      </div>
    </div>
  );
}
