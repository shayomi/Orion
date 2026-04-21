import {
  listAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "@/app/actions/admin";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/admin/pagination";
import { UserRowActions } from "@/components/admin/user-row-actions";
import { requireActiveAdmin } from "@/lib/admin";

type UsersPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50";

function formatDate(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  await requireActiveAdmin();

  const { q, page: pageStr } = await searchParams;
  const search = q?.trim() ?? "";
  const page = Math.max(1, Number(pageStr) || 1);

  const { items: users, total, totalPages } = await listAdminUsers(search, page);

  const activeCount = users.filter((u) => u.status === "active").length;
  const suspendedCount = users.filter((u) => u.status === "suspended").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  return (
    <div>
      <Topbar title="User Management" subtitle="Review and manage platform access" />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Total users</CardDescription>
              <CardTitle>{total}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Active (page)</CardDescription>
              <CardTitle>{activeCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Suspended (page)</CardDescription>
              <CardTitle>{suspendedCount}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Admins (page)</CardDescription>
              <CardTitle>{adminCount}</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Directory</CardTitle>
            <CardDescription>Search by name, email, role, or status</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <form method="get" className="flex flex-col gap-3 sm:flex-row">
              <input
                name="q"
                defaultValue={search}
                placeholder="Search users"
                className={inputClass}
              />
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>

            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="min-w-full divide-y divide-gray-100 text-sm">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-gray-900">
                          {user.name || "Unnamed user"}
                        </p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <Badge variant={user.role === "admin" ? "info" : "default"}>
                          {user.role}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <Badge variant={user.status === "active" ? "success" : "warning"}>
                          {user.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-600">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <UserRowActions
                          userId={user.id}
                          currentRole={user.role}
                          currentStatus={user.status}
                          updateRoleAction={updateAdminUserRole}
                          updateStatusAction={updateAdminUserStatus}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              basePath="/admin/users"
              searchParams={{ q: search || undefined }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
