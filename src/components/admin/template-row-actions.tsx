"use client";

import { useActionState } from "react";
import {
  archiveAssessmentTemplate,
  deleteAssessmentTemplate,
  publishAssessmentTemplate,
} from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";

interface TemplateRowActionsProps {
  templateId: string;
  status: string;
}

export function TemplateRowActions({
  templateId,
  status,
}: TemplateRowActionsProps) {
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
        "Permanently delete this template? This action cannot be undone."
      )
    )
      return;
    delAction(formData);
  }

  const error = pubState.error || archState.error || delState.error;

  return (
    <>
      {status !== "published" && (
        <form action={pubAction}>
          <input type="hidden" name="templateId" value={templateId} />
          <Button size="sm" type="submit" disabled={pubPending}>
            {pubPending ? "..." : "Publish"}
          </Button>
        </form>
      )}

      {status !== "archived" && (
        <form action={handleArchive}>
          <input type="hidden" name="templateId" value={templateId} />
          <Button size="sm" variant="outline" type="submit" disabled={archPending}>
            {archPending ? "..." : "Archive"}
          </Button>
        </form>
      )}

      {status !== "published" && (
        <form action={handleDelete}>
          <input type="hidden" name="templateId" value={templateId} />
          <Button size="sm" variant="danger" type="submit" disabled={delPending}>
            {delPending ? "..." : "Delete"}
          </Button>
        </form>
      )}

      {error && <p className="text-xs text-red-600 w-full">{error}</p>}
    </>
  );
}
