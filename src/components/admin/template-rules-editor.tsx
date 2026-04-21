"use client";

import { useActionState } from "react";
import {
  createAssessmentRule,
  deleteAssessmentRule,
  updateAssessmentRule,
} from "@/app/actions/admin";
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

const textareaClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50";

interface Rule {
  id: string;
  templateId: string;
  name: string;
  description: string | null;
  condition: unknown;
  severity: string;
  resolutionPath: string;
  recommendationTitle: string;
  recommendationDescription: string;
  priority: number;
}

function formatJson(value: unknown) {
  if (value == null) return "";
  return JSON.stringify(value, null, 2);
}

function RuleBlock({ rule }: { rule: Rule }) {
  const [updateState, updateAction, updatePending] = useActionState<
    ActionState,
    FormData
  >(updateAssessmentRule, { error: null });

  const [deleteState, deleteAction, deletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAssessmentRule, { error: null });

  function handleDelete(formData: FormData) {
    if (!window.confirm("Delete this rule? This cannot be undone.")) return;
    deleteAction(formData);
  }

  const error = updateState.error || deleteState.error;

  return (
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-gray-900">{rule.name}</p>
          <p className="text-xs text-gray-500">
            {rule.severity} &bull; {rule.resolutionPath} &bull; priority{" "}
            {rule.priority}
          </p>
        </div>
        <form action={handleDelete}>
          <input type="hidden" name="ruleId" value={rule.id} />
          <Button
            size="sm"
            variant="danger"
            type="submit"
            disabled={deletePending}
          >
            {deletePending ? "..." : "Delete"}
          </Button>
        </form>
      </div>

      <form action={updateAction} className="space-y-2">
        <input type="hidden" name="ruleId" value={rule.id} />
        <div className="grid gap-2 md:grid-cols-2">
          <input
            name="name"
            defaultValue={rule.name}
            required
            className={inputClass}
          />
          <input
            name="description"
            defaultValue={rule.description || ""}
            placeholder="Description"
            className={inputClass}
          />
          <select
            name="severity"
            defaultValue={rule.severity}
            className={inputClass}
          >
            <option value="critical">critical</option>
            <option value="high">high</option>
            <option value="medium">medium</option>
            <option value="low">low</option>
            <option value="info">info</option>
          </select>
          <select
            name="resolutionPath"
            defaultValue={rule.resolutionPath}
            className={inputClass}
          >
            <option value="self_serve">self_serve</option>
            <option value="document_generation">document_generation</option>
            <option value="expert_referral">expert_referral</option>
          </select>
          <input
            name="recommendationTitle"
            defaultValue={rule.recommendationTitle}
            required
            className={inputClass}
          />
          <input
            name="recommendationDescription"
            defaultValue={rule.recommendationDescription}
            required
            className={inputClass}
          />
          <input
            name="priority"
            type="number"
            defaultValue={rule.priority}
            className={inputClass}
          />
        </div>
        <textarea
          name="condition"
          defaultValue={formatJson(rule.condition)}
          rows={4}
          required
          placeholder="Condition JSON"
          className={textareaClass}
        />
        <Button type="submit" variant="outline" disabled={updatePending}>
          {updatePending ? "Saving\u2026" : "Save rule"}
        </Button>
      </form>

      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

interface TemplateRulesEditorProps {
  templateId: string;
  rules: Rule[];
}

export function TemplateRulesEditor({
  templateId,
  rules,
}: TemplateRulesEditorProps) {
  const [addState, addAction, addPending] = useActionState<
    ActionState,
    FormData
  >(createAssessmentRule, { error: null });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rules</CardTitle>
        <CardDescription>
          Define condition-based recommendations and resolution paths
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form
          action={addAction}
          className="space-y-3 rounded-xl border border-gray-100 p-4"
        >
          <input type="hidden" name="templateId" value={templateId} />
          <div className="grid gap-2 md:grid-cols-2">
            <input
              name="name"
              placeholder="Rule name"
              required
              className={inputClass}
            />
            <input
              name="description"
              placeholder="Description"
              className={inputClass}
            />
            <select
              name="severity"
              defaultValue="medium"
              className={inputClass}
            >
              <option value="critical">critical</option>
              <option value="high">high</option>
              <option value="medium">medium</option>
              <option value="low">low</option>
              <option value="info">info</option>
            </select>
            <select
              name="resolutionPath"
              defaultValue="self_serve"
              className={inputClass}
            >
              <option value="self_serve">self_serve</option>
              <option value="document_generation">document_generation</option>
              <option value="expert_referral">expert_referral</option>
            </select>
            <input
              name="recommendationTitle"
              placeholder="Recommendation title"
              required
              className={inputClass}
            />
            <input
              name="recommendationDescription"
              placeholder="Recommendation description"
              required
              className={inputClass}
            />
            <input
              name="priority"
              type="number"
              defaultValue={0}
              className={inputClass}
            />
          </div>
          <textarea
            name="condition"
            defaultValue={"{}"}
            rows={4}
            required
            placeholder="Condition JSON"
            className={textareaClass}
          />
          <Button type="submit" disabled={addPending}>
            {addPending ? "Adding\u2026" : "Add rule"}
          </Button>
        </form>
        {addState.error && (
          <p className="text-sm text-red-600">{addState.error}</p>
        )}

        <div className="space-y-3">
          {rules.map((rule) => (
            <RuleBlock key={rule.id} rule={rule} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
