import { Sidebar, SidebarProvider } from "@/components/layout/sidebar";
import { PersistGuestCheck } from "@/components/health-check/persist-guest-check";
import { getDashboardData } from "@/app/actions/dashboard";
import { MainContent } from "@/components/layout/main-content";

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
    <SidebarProvider userName={userInfo.name} userEmail={userInfo.email}>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-indigo-50/40">
        <PersistGuestCheck />
        <Sidebar user={userInfo} startup={startupInfo} />
        <MainContent>{children}</MainContent>
      </div>
    </SidebarProvider>
  );
}
