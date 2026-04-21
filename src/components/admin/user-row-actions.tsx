"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import type { ActionState } from "@/app/actions/admin";

const selectClass =
  "rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50";

interface UserRowActionsProps {
  userId: string;
  currentRole: string;
  currentStatus: string;
  updateRoleAction: (
    prev: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
  updateStatusAction: (
    prev: ActionState,
    formData: FormData
  ) => Promise<ActionState>;
}

export function UserRowActions({
  userId,
  currentRole,
  currentStatus,
  updateRoleAction,
  updateStatusAction,
}: UserRowActionsProps) {
  const [roleState, roleAction, rolePending] = useActionState(
    updateRoleAction,
    { error: null }
  );
  const [statusState, statusAction, statusPending] = useActionState(
    updateStatusAction,
    { error: null }
  );

  function handleStatusSubmit(formData: FormData) {
    const newStatus = formData.get("status");
    if (
      newStatus === "suspended" &&
      !window.confirm(
        "Are you sure you want to suspend this user? They will lose access immediately."
      )
    ) {
      return;
    }
    statusAction(formData);
  }

  function handleRoleSubmit(formData: FormData) {
    const newRole = formData.get("role");
    if (
      newRole === "admin" &&
      !window.confirm(
        "Promote this user to admin? They will gain full admin privileges."
      )
    ) {
      return;
    }
    roleAction(formData);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row">
        <form action={handleRoleSubmit} className="flex items-center gap-2">
          <input type="hidden" name="userId" value={userId} />
          <select name="role" defaultValue={currentRole} className={selectClass}>
            <option value="member">member</option>
            <option value="admin">admin</option>
          </select>
          <Button size="sm" type="submit" variant="outline" disabled={rolePending}>
            {rolePending ? "..." : "Update role"}
          </Button>
        </form>

        <form action={handleStatusSubmit} className="flex items-center gap-2">
          <input type="hidden" name="userId" value={userId} />
          <select
            name="status"
            defaultValue={currentStatus}
            className={selectClass}
          >
            <option value="active">active</option>
            <option value="suspended">suspended</option>
          </select>
          <Button
            size="sm"
            type="submit"
            variant="outline"
            disabled={statusPending}
          >
            {statusPending ? "..." : "Update status"}
          </Button>
        </form>
      </div>

      {roleState.error && (
        <p className="text-xs text-red-600">{roleState.error}</p>
      )}
      {statusState.error && (
        <p className="text-xs text-red-600">{statusState.error}</p>
      )}
    </div>
  );
}
