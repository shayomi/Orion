import { hasAdminUser } from "@/app/actions/admin-setup";
import { redirect } from "next/navigation";
import { AdminCreateForm } from "@/components/admin/admin-create-form";

export default async function AdminCreatePage() {
  const adminExists = await hasAdminUser();

  if (adminExists) {
    redirect("/login");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600">
            <span className="text-xl font-bold text-white">O</span>
          </div>
          <h1 className="mt-4 text-2xl font-bold text-gray-900">
            Create Admin Account
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Set up the first administrator for your Orion platform. This page
            can only be used once.
          </p>
        </div>

        <AdminCreateForm />
      </div>
    </div>
  );
}
