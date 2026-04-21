"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";

export type ActionState = { error: string | null };

const initialState: ActionState = { error: null };

interface ActionFormProps {
  action: (prevState: ActionState, formData: FormData) => Promise<ActionState>;
  children: React.ReactNode;
  submitLabel?: string;
  submitVariant?: "primary" | "outline" | "danger";
  submitSize?: "sm" | "md";
  confirmMessage?: string;
  className?: string;
}

export function ActionForm({
  action,
  children,
  submitLabel = "Submit",
  submitVariant = "primary",
  submitSize = "md",
  confirmMessage,
  className,
}: ActionFormProps) {
  const [state, formAction, isPending] = useActionState(action, initialState);

  function handleSubmit(formData: FormData) {
    if (confirmMessage && !window.confirm(confirmMessage)) return;
    formAction(formData);
  }

  return (
    <form action={handleSubmit} className={className}>
      {children}
      {state.error && (
        <p className="mt-1.5 text-sm text-red-600">{state.error}</p>
      )}
      <Button
        type="submit"
        variant={submitVariant}
        size={submitSize}
        disabled={isPending}
      >
        {isPending ? "Working\u2026" : submitLabel}
      </Button>
    </form>
  );
}
