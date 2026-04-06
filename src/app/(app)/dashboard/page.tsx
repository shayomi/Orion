import { Topbar } from "@/components/layout/topbar";
import WelcomeBanner from "@/components/dashboard/overview/welcome-banner";
import StatsGrid from "@/components/dashboard/overview/stats-grid";
import ActiveWorkflowCard from "@/components/dashboard/overview/active-workflow-card";
import QuickActions from "@/components/dashboard/overview/quick-actions";
import AlertsPanel from "@/components/dashboard/overview/alerts-panel";
import { mockOrganization } from "@/lib/mock-data";

export default function DashboardPage() {
  return (
    <div>
      <Topbar title="Overview" subtitle={mockOrganization.name} />
      <div className="p-6 space-y-6">
        <WelcomeBanner />
        <StatsGrid />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <ActiveWorkflowCard />
            <QuickActions />
          </div>
          <AlertsPanel />
        </div>
      </div>
    </div>
  );
}
