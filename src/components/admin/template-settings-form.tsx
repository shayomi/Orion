"use client";

import { useActionState } from "react";
import {
  archiveAssessmentTemplate,
  deleteAssessmentTemplate,
  publishAssessmentTemplate,
  updateAssessmentTemplate,
} from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

const inputClass =
  "w-full rounded-lg bg-gray-50/80 px-3 py-2 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors";

interface TemplateSettingsFormProps {
  template: {
    id: string;
    name: string;
    description: string | null;
    status: string;
  };
}

export function TemplateSettingsForm({ template }: TemplateSettingsFormProps) {
  const [updateState, updateAction, updatePending] = useActionState<
    ActionState,
    FormData
  >(updateAssessmentTemplate, { error: null });

  const [pubState, pubAction, pubPending] = useActionState<
    ActionState,
    FormData
  >(publishAssessmentTemplate, { error: null });

  const [archState, archAction, archPending] = useActionState<
    ActionState,
    FormData
  >(archiveAssessmentTemplate, { error: null });

  const [delState, delAction, delPending] = useActionState<
    ActionState,
    FormData
  >(deleteAssessmentTemplate, { error: null });

  function handleArchive(formData: FormData) {
    if (
      !window.confirm(
        "Archive this template? It will no longer be available for new assessments."
      )
    )
      return;
    archAction(formData);
  }

  function handleDelete(formData: FormData) {
    if (
      !window.confirm(
        "Permanently delete this template and all its sections, questions, and rules? This cannot be undone."
      )
    )
      return;
    delAction(formData);
  }

  const error =
    updateState.error || pubState.error || archState.error || delState.error;

  return (
    <div className="bg-white rounded-xl">
      <div className="px-6 pt-6 pb-2">
        <h2 className="text-base font-semibold text-gray-900">Template settings</h2>
        <p className="text-sm text-gray-400 mt-0.5">
          Update basic metadata and lifecycle status
        </p>
      </div>
      <div className="px-6 pb-6 space-y-4">
        <form action={updateAction} className="space-y-3">
          <input type="hidden" name="templateId" value={template.id} />
          <div className="grid gap-3 md:grid-cols-2">
            <input
              name="name"
              defaultValue={template.name}
              required
              className={inputClass}
            />
            <input
              name="description"
              defaultValue={template.description || ""}
              placeholder="Description"
              className={inputClass}
            />
          </div>
          <Button type="submit" disabled={updatePending}>
            {updatePending ? "Saving\u2026" : "Save template"}
          </Button>
        </form>

        <div className="flex flex-wrap gap-2 border-t border-gray-100/60 pt-4">
          {template.status !== "published" && (
            <form action={pubAction}>
              <input type="hidden" name="templateId" value={template.id} />
              <Button type="submit" disabled={pubPending}>
                {pubPending ? "Publishing\u2026" : "Publish"}
              </Button>
            </form>
          )}

          {template.status !== "archived" && (
            <form action={handleArchive}>
              <input type="hidden" name="templateId" value={template.id} />
              <Button type="submit" variant="outline" disabled={archPending}>
                {archPending ? "Archiving\u2026" : "Archive"}
              </Button>
            </form>
          )}

          {template.status !== "published" && (
            <form action={handleDelete}>
              <input type="hidden" name="templateId" value={template.id} />
              <Button type="submit" variant="danger" disabled={delPending}>
                {delPending ? "Deleting\u2026" : "Delete template"}
              </Button>
            </form>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
