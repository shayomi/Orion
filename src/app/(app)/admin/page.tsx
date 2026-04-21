import Link from "next/link";
import { Topbar } from "@/components/layout/topbar";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { requireActiveAdmin } from "@/lib/admin";
import { getTemplateStatusCounts, getRecentAdminAuditEvents } from "@/app/actions/admin";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { sql } from "drizzle-orm";

async function getUserStats() {
  const rows = await db
    .select({
      role: users.role,
      status: users.status,
      count: sql<number>`count(*)::int`,
    })
    .from(users)
    .groupBy(users.role, users.status);

  const stats = { total: 0, active: 0, suspended: 0, admins: 0, members: 0 };
  for (const row of rows) {
    stats.total += row.count;
    if (row.status === "active") stats.active += row.count;
    if (row.status === "suspended") stats.suspended += row.count;
    if (row.role === "admin") stats.admins += row.count;
    if (row.role === "member") stats.members += row.count;
  }
  return stats;
}

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
    getUserStats(),
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
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Link href="/admin/users">
            <Card className="hover:border-indigo-200 transition-colors cursor-pointer">
              <CardHeader>
                <CardDescription>Total users</CardDescription>
                <CardTitle>{userStats.total}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/users?q=admin">
            <Card className="hover:border-indigo-200 transition-colors cursor-pointer">
              <CardHeader>
                <CardDescription>Admins</CardDescription>
                <CardTitle>{userStats.admins}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/assessments">
            <Card className="hover:border-indigo-200 transition-colors cursor-pointer">
              <CardHeader>
                <CardDescription>Published templates</CardDescription>
                <CardTitle>{templateCounts.published}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/assessments?q=draft">
            <Card className="hover:border-indigo-200 transition-colors cursor-pointer">
              <CardHeader>
                <CardDescription>Draft templates</CardDescription>
                <CardTitle>{templateCounts.draft}</CardTitle>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Quick links */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Link href="/admin/users">
            <Card className="hover:border-indigo-200 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">User Management</CardTitle>
                <CardDescription>
                  {userStats.active} active, {userStats.suspended} suspended
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
          <Link href="/admin/assessments">
            <Card className="hover:border-indigo-200 transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-base">Assessment Templates</CardTitle>
                <CardDescription>
                  {templateCounts.published} published, {templateCounts.draft}{" "}
                  drafts, {templateCounts.archived} archived
                </CardDescription>
              </CardHeader>
            </Card>
          </Link>
        </div>

        {/* Recent audit log */}
        <Card>
          <CardHeader>
            <CardTitle>Recent admin activity</CardTitle>
            <CardDescription>Last 10 admin actions</CardDescription>
          </CardHeader>
          <div className="px-6 pb-6">
            {recentAudit.length === 0 ? (
              <p className="text-sm text-gray-500">No admin activity yet.</p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="min-w-full divide-y divide-gray-100 text-sm">
                  <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                    <tr>
                      <th className="px-4 py-3 font-medium">Action</th>
                      <th className="px-4 py-3 font-medium">Entity</th>
                      <th className="px-4 py-3 font-medium">Actor</th>
                      <th className="px-4 py-3 font-medium">When</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {recentAudit.map((event) => (
                      <tr key={event.id}>
                        <td className="px-4 py-3 text-gray-900">
                          {formatAction(event.action)}
                        </td>
                        <td className="px-4 py-3">
                          <Badge variant="outline">{event.entityType}</Badge>
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {event.actorEmail || "System"}
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {formatDate(event.createdAt)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
