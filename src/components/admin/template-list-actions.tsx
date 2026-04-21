"use client";

import { useActionState } from "react";
import { createAssessmentTemplate } from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50";

export function TemplateListActions() {
  const [state, formAction, isPending] = useActionState<ActionState, FormData>(
    createAssessmentTemplate,
    { error: null }
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create template</CardTitle>
        <CardDescription>
          Start a new assessment template in draft mode
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          action={formAction}
          className="grid gap-3 md:grid-cols-[2fr_3fr_auto]"
        >
          <input
            name="name"
            placeholder="Template name"
            required
            className={inputClass}
          />
          <input
            name="description"
            placeholder="Description (optional)"
            className={inputClass}
          />
          <Button type="submit" disabled={isPending}>
            {isPending ? "Creating\u2026" : "Create"}
          </Button>
        </form>
        {state.error && (
          <p className="mt-2 text-sm text-red-600">{state.error}</p>
        )}
      </CardContent>
    </Card>
  );
}
