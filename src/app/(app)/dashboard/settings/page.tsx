import { Topbar } from "@/components/layout/topbar";
import SettingsPanel from "@/components/dashboard/settings/settings-panel";
import { getDashboardData } from "@/app/actions/dashboard";

export default async function SettingsPage() {
  const data = await getDashboardData();

  const userInfo = data
    ? { name: data.user.name, email: data.user.email }
    : { name: "", email: "" };

  const startupInfo = data?.startup
    ? {
        name: data.startup.name,
        stage: data.startup.stage,
        structure: data.startup.structure,
        primaryJurisdiction: data.startup.primaryJurisdiction,
      }
    : null;

  const initials = userInfo.name
    .split(" ")
    .map((n) => n.charAt(0))
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div>
      <Topbar title="Settings" userInitials={initials} />
      <div className="p-6">
        <SettingsPanel user={userInfo} startup={startupInfo} />
      </div>
    </div>
  );
}
