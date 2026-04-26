import {
  listAdminUsers,
  updateAdminUserRole,
  updateAdminUserStatus,
} from "@/app/actions/admin";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
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
  "w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-colors";

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
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Total users</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Active (page)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{activeCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Suspended (page)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{suspendedCount}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Admins (page)</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{adminCount}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Directory</h2>
            <p className="text-sm text-gray-400 mt-0.5">Search by name, email, role, or status</p>
          </div>
          <div className="px-6 pb-6 space-y-4">
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

            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-100/60 text-sm">
                <thead className="bg-gray-50/30 text-left text-xs uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">User</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Created</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/60">
                  {users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-gray-900">
                          {user.name || "Unnamed user"}
                        </p>
                        <p className="text-xs text-gray-400">{user.email}</p>
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
                      <td className="px-4 py-3 align-top text-gray-500">
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
          </div>
        </div>
      </div>
    </div>
  );
}
