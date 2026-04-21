"use client";

import { useActionState } from "react";
import { createBootstrapAdmin } from "@/app/actions/admin-setup";
import type { SetupState } from "@/app/actions/admin-setup";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 placeholder:text-gray-400";

const labelClass = "block text-sm font-medium text-gray-700 mb-1.5";

export function AdminCreateForm() {
  const [state, formAction, isPending] = useActionState<SetupState, FormData>(
    createBootstrapAdmin,
    { error: null, success: false }
  );

  if (state.success) {
    return (
      <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100">
          <svg
            className="h-5 w-5 text-emerald-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4.5 12.75l6 6 9-13.5"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-emerald-900">
          Admin account created
        </h2>
        <p className="mt-1 text-sm text-emerald-700">
          You can now sign in with your credentials.
        </p>
        <Link
          href="/login"
          className="mt-4 inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          Go to login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="space-y-5">
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
        <div>
          <label htmlFor="name" className={labelClass}>
            Full name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Jane Doe"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="email" className={labelClass}>
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="admin@yourcompany.com"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="password" className={labelClass}>
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            placeholder="At least 8 characters"
            className={inputClass}
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            minLength={8}
            placeholder="Re-enter your password"
            className={inputClass}
          />
        </div>

        {state.error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="w-full"
        >
          {isPending ? "Creating admin account\u2026" : "Create admin account"}
        </Button>
      </div>

      <p className="text-center text-xs text-gray-400">
        This page will be permanently locked after the first admin is created.
      </p>
    </form>
  );
}
