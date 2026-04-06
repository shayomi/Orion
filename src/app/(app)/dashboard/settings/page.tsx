import { Topbar } from "@/components/layout/topbar";
import SettingsPanel from "@/components/dashboard/settings/settings-panel";

export default function SettingsPage() {
  return (
    <div>
      <Topbar title="Settings" />
      <div className="p-6">
        <SettingsPanel />
      </div>
    </div>
  );
}
