import { Sidebar } from "@/components/layout/sidebar";
import { PersistGuestCheck } from "@/components/health-check/persist-guest-check";
import { getDashboardData } from "@/app/actions/dashboard";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const data = await getDashboardData();

  const userInfo = data
    ? {
        name: data.user.name,
        email: data.user.email,
        role: data.user.role,
        status: data.user.status,
      }
    : { name: "User", email: "", role: "member" as const, status: "active" as const };

  const startupInfo = data?.startup
    ? { name: data.startup.name, stage: data.startup.stage }
    : null;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      <PersistGuestCheck />
      <Sidebar user={userInfo} startup={startupInfo} />
      <main className="ml-60 min-h-screen">{children}</main>
    </div>
  );
}
