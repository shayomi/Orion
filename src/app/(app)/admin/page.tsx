import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { requireActiveAdmin } from "@/lib/admin";
import { getTemplateStatusCounts, getRecentAdminAuditEvents, getAdminUserStats } from "@/app/actions/admin";

export const dynamic = "force-dynamic";

function formatDate(value: Date | string | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString();
}

function formatAction(action: string) {
  return action
    .replace(/^admin_/, "")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default async function AdminDashboardPage() {
  const admin = await requireActiveAdmin();

  const [userStats, templateCounts, recentAudit] = await Promise.all([
    getAdminUserStats(),
    getTemplateStatusCounts(),
    getRecentAdminAuditEvents(10),
  ]);

  return (
    <div>
      <Topbar
        title="Admin Dashboard"
        subtitle={`Welcome back, ${admin.name || admin.email}`}
      />
      <div className="space-y-6 p-6">
        {/* Quick stats */}
        <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
          <Link href="/admin/users">
            <div className="bg-white rounded-xl p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <p className="text-sm text-gray-400">Total users</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.total}</p>
            </div>
          </Link>
          <Link href="/admin/users?q=admin">
            <div className="bg-white rounded-xl p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <p className="text-sm text-gray-400">Admins</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{userStats.admins}</p>
            </div>
          </Link>
          <Link href="/admin/assessments">
            <div className="bg-white rounded-xl p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <p className="text-sm text-gray-400">Published templates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{templateCounts.published}</p>
            </div>
          </Link>
          <Link href="/admin/assessments?q=draft">
            <div className="bg-white rounded-xl p-5 hover:bg-gray-50/50 transition-colors cursor-pointer">
              <p className="text-sm text-gray-400">Draft templates</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">{templateCounts.draft}</p>
            </div>
          </Link>
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/users">
            <div className="bg-white rounded-xl p-5 hover:bg-gray-50/50 transition-colors cursor-pointer h-full">
              <p className="text-base font-semibold text-gray-900">User Management</p>
              <p className="text-sm text-gray-400 mt-1">
                {userStats.active} active, {userStats.suspended} suspended
              </p>
            </div>
          </Link>
          <Link href="/admin/assessments">
            <div className="bg-white rounded-xl p-5 hover:bg-gray-50/50 transition-colors cursor-pointer h-full">
              <p className="text-base font-semibold text-gray-900">Assessment Templates</p>
              <p className="text-sm text-gray-400 mt-1">
                {templateCounts.published} published, {templateCounts.draft}{" "}
                drafts, {templateCounts.archived} archived
              </p>
            </div>
          </Link>
        </div>

        {/* Recent audit log */}
        <div className="bg-white rounded-xl">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Recent admin activity</h2>
            <p className="text-sm text-gray-400 mt-0.5">Last 10 admin actions</p>
          </div>
          <div className="px-6 pb-6">
            {recentAudit.length === 0 ? (
              <p className="text-sm text-gray-400">No admin activity yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl">
                <table className="min-w-full divide-y divide-gray-100/60 text-sm">
                  <thead className="bg-gray-50/30 text-left text-xs uppercase tracking-wide text-gray-400">
                    <tr>
                      <th className="px-4 py-3 font-medium">Action</th>
                      <th className="px-4 py-3 font-medium">Entity</th>
                      <th className="px-4 py-3 font-medium">Actor</th>
                      <th className="px-4 py-3 font-medium">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50/60">
                    {recentAudit.map((event) => (
                      <tr key={event.id}>
                        <td className="px-4 py-3 text-gray-900">
                          {formatAction(event.action)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{event.entityType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-500">
                          {event.actorEmail || "System"}
                        </td>
                        <td className="px-4 py-3 text-gray-400 text-xs">
                          {formatDate(event.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
