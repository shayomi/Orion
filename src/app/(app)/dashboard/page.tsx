import { Topbar } from "@/components/layout/topbar";
import WelcomeBanner from "@/components/dashboard/overview/welcome-banner";
import StatsGrid from "@/components/dashboard/overview/stats-grid";
import QuickActions from "@/components/dashboard/overview/quick-actions";
import AlertsPanel from "@/components/dashboard/overview/alerts-panel";
import RecentDocuments from "@/components/dashboard/overview/recent-documents";
import ReevaluateButton from "@/components/dashboard/overview/reevaluate-button";
import { getDashboardData } from "@/app/actions/dashboard";

export default async function DashboardPage() {
  const data = await getDashboardData();

  const userName = data?.user.name || "User";
  const firstName = userName.split(" ")[0];
  const initials = userName
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const startup = data?.startup;
  const stats = data?.stats || {
    documentCount: 0,
    issueCount: 0,
    resolvedCount: 0,
    criticalCount: 0,
  };

  const activeIssues = (data?.issues || []).filter((i) => !i.isResolved);
  const recentDocs = data?.recentDocs || [];

  return (
    <div>
      <Topbar
        title="Overview"
        subtitle={startup?.name || "My Startup"}
        userInitials={initials}
        userName={userName}
        userEmail={data?.user.email || ""}
        startupName={startup?.name}
        startupStage={startup?.stage}
      />
      <div className="p-6 space-y-6">
        <WelcomeBanner
          firstName={firstName}
          startupName={startup?.name || null}
          jurisdiction={startup?.primaryJurisdiction || null}
          stage={startup?.stage || null}
          riskScore={startup?.riskScore ?? null}
        />
        <StatsGrid
          documentCount={stats.documentCount}
          issueCount={stats.issueCount}
          criticalCount={stats.criticalCount}
          riskScore={startup?.riskScore ?? null}
        />
        <ReevaluateButton />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-6">
            <RecentDocuments docs={recentDocs} />
            <QuickActions />
          </div>
          <AlertsPanel issues={activeIssues} />
        </div>
      </div>
    </div>
  );
}
