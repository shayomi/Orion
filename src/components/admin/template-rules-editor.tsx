"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  createAssessmentRule,
  deleteAssessmentRule,
  updateAssessmentRule,
} from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Pencil, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg bg-gray-50/80 px-3 py-2 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors";

const textareaClass =
  "w-full rounded-lg bg-gray-50/80 px-3 py-2 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors";

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

const severityColors: Record<string, string> = {
  critical: "bg-red-100/60 text-red-700",
  high: "bg-orange-100/60 text-orange-700",
  medium: "bg-amber-100/60 text-amber-700",
  low: "bg-emerald-100/60 text-emerald-700",
  info: "bg-blue-100/60 text-blue-700",
};

function RuleBlock({ rule }: { rule: Rule }) {
  const [editing, setEditing] = useState(false);

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
  const sevClass = severityColors[rule.severity] || "bg-gray-100/60 text-gray-600";

  return (
    <div className="group rounded-lg bg-gray-50/40 hover:bg-gray-50/80 transition-colors">
      {/* Rule header */}
      <div className="flex items-start gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{rule.name}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className={cn("text-xs px-1.5 py-0.5 rounded-md font-medium", sevClass)}>
              {rule.severity}
            </span>
            <span className="text-xs text-gray-400">{rule.resolutionPath.replace(/_/g, " ")}</span>
            <span className="text-xs text-gray-300">&middot;</span>
            <span className="text-xs text-gray-400">priority {rule.priority}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
            title="Edit rule"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <form action={handleDelete}>
            <input type="hidden" name="ruleId" value={rule.id} />
            <button
              type="submit"
              disabled={deletePending}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Delete rule"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Expandable edit form */}
      {editing && (
        <div className="px-4 pb-4 pt-1">
          <form action={updateAction} className="space-y-3">
            <input type="hidden" name="ruleId" value={rule.id} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Name</label>
                <input name="name" defaultValue={rule.name} required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                <input name="description" defaultValue={rule.description || ""} placeholder="Description" className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Severity</label>
                <select name="severity" defaultValue={rule.severity} className={inputClass}>
                  <option value="critical">critical</option>
                  <option value="high">high</option>
                  <option value="medium">medium</option>
                  <option value="low">low</option>
                  <option value="info">info</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Resolution path</label>
                <select name="resolutionPath" defaultValue={rule.resolutionPath} className={inputClass}>
                  <option value="self_serve">self_serve</option>
                  <option value="document_generation">document_generation</option>
                  <option value="expert_referral">expert_referral</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Recommendation title</label>
                <input name="recommendationTitle" defaultValue={rule.recommendationTitle} required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Recommendation description</label>
                <input name="recommendationDescription" defaultValue={rule.recommendationDescription} required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                <input name="priority" type="number" defaultValue={rule.priority} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Condition JSON</label>
              <textarea name="condition" defaultValue={formatJson(rule.condition)} rows={4} required className={textareaClass} />
            </div>
            <div className="flex items-center gap-2">
              <Button type="submit" size="sm" disabled={updatePending}>
                {updatePending ? "Saving..." : "Save"}
              </Button>
              <Button type="button" size="sm" variant="ghost" onClick={() => setEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
          {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
        </div>
      )}
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
  const [addingRule, setAddingRule] = useState(false);

  const [addState, addAction, addPending] = useActionState<
    ActionState,
    FormData
  >(createAssessmentRule, { error: null });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Rules</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {rules.length} rule{rules.length !== 1 ? "s" : ""} — condition-based recommendations
          </p>
        </div>
        <Button
          size="sm"
          variant={addingRule ? "ghost" : "outline"}
          onClick={() => setAddingRule(!addingRule)}
        >
          {addingRule ? "Cancel" : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add rule
            </>
          )}
        </Button>
      </div>

      {addingRule && (
        <div className="mb-8 p-4 rounded-xl bg-white">
          <p className="text-xs font-medium text-gray-500 mb-3">New rule</p>
          <form action={addAction} className="space-y-3">
            <input type="hidden" name="templateId" value={templateId} />
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Name</label>
                <input name="name" placeholder="Rule name" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                <input name="description" placeholder="Description" className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Severity</label>
                <select name="severity" defaultValue="medium" className={inputClass}>
                  <option value="critical">critical</option>
                  <option value="high">high</option>
                  <option value="medium">medium</option>
                  <option value="low">low</option>
                  <option value="info">info</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Resolution path</label>
                <select name="resolutionPath" defaultValue="self_serve" className={inputClass}>
                  <option value="self_serve">self_serve</option>
                  <option value="document_generation">document_generation</option>
                  <option value="expert_referral">expert_referral</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Recommendation title</label>
                <input name="recommendationTitle" placeholder="Recommendation title" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Recommendation description</label>
                <input name="recommendationDescription" placeholder="Recommendation description" required className={inputClass} />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-500 mb-1 block">Priority</label>
                <input name="priority" type="number" defaultValue={0} className={inputClass} />
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Condition JSON</label>
              <textarea name="condition" defaultValue="{}" rows={4} required className={textareaClass} />
            </div>
            <Button type="submit" size="sm" disabled={addPending}>
              {addPending ? "Adding..." : "Add rule"}
            </Button>
          </form>
          {addState.error && (
            <p className="mt-2 text-sm text-red-600">{addState.error}</p>
          )}
        </div>
      )}

      <div className="space-y-3 bg-white rounded-xl p-5">
        {rules.length === 0 ? (
          <p className="text-sm text-gray-400">No rules defined yet.</p>
        ) : (
          rules.map((rule) => (
            <RuleBlock key={rule.id} rule={rule} />
          ))
        )}
      </div>
    </div>
  );
}
