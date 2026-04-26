"use client";

import { useState } from "react";
import { useActionState } from "react";
import {
  createAssessmentQuestion,
  createAssessmentSection,
  deleteAssessmentQuestion,
  deleteAssessmentSection,
  updateAssessmentQuestion,
  updateAssessmentSection,
} from "@/app/actions/admin";
import type { ActionState } from "@/app/actions/admin";
import { Button } from "@/components/ui/button";
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Trash2,
  GripVertical,
  Pencil,
} from "lucide-react";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-lg bg-gray-50/80 px-3 py-2 text-sm text-gray-900 outline-none focus:bg-white focus:ring-2 focus:ring-indigo-100 transition-colors";

interface Section {
  id: string;
  templateId: string;
  title: string;
  description: string | null;
  orderIndex: number;
}

interface Question {
  id: string;
  sectionId: string;
  questionKey: string;
  prompt: string;
  description: string | null;
  inputType: string;
  options: unknown;
  domain: string | null;
  required: boolean;
  weight: number;
  orderIndex: number;
}

interface TemplateSectionsEditorProps {
  templateId: string;
  sections: Section[];
  questions: Question[];
}

function formatJson(value: unknown) {
  if (value == null) return "";
  return JSON.stringify(value, null, 2);
}

const domainColors: Record<string, string> = {
  legal: "bg-purple-100/60 text-purple-700",
  operations: "bg-blue-100/60 text-blue-700",
  finance: "bg-emerald-100/60 text-emerald-700",
  compliance: "bg-amber-100/60 text-amber-700",
  governance: "bg-rose-100/60 text-rose-700",
  ip: "bg-cyan-100/60 text-cyan-700",
  hr: "bg-orange-100/60 text-orange-700",
};

function SectionBlock({
  section,
  sectionQuestions,
}: {
  section: Section;
  sectionQuestions: Question[];
}) {
  const [expanded, setExpanded] = useState(true);
  const [editingSection, setEditingSection] = useState(false);
  const [addingQuestion, setAddingQuestion] = useState(false);

  const [updateState, updateAction, updatePending] = useActionState<
    ActionState,
    FormData
  >(updateAssessmentSection, { error: null });

  const [deleteState, deleteAction, deletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAssessmentSection, { error: null });

  const [addQState, addQAction, addQPending] = useActionState<
    ActionState,
    FormData
  >(createAssessmentQuestion, { error: null });

  function handleDeleteSection(formData: FormData) {
    if (
      !window.confirm(
        "Delete this section and all its questions? This cannot be undone."
      )
    )
      return;
    deleteAction(formData);
  }

  return (
    <div className="rounded-xl bg-white">
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 py-4">
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          {expanded ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
        </button>
        <GripVertical className="w-3.5 h-3.5 text-gray-300" />
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900">{section.title}</h3>
          {section.description && (
            <p className="text-xs text-gray-400 mt-0.5">{section.description}</p>
          )}
        </div>
        <span className="text-xs text-gray-400 tabular-nums">
          {sectionQuestions.length} question{sectionQuestions.length !== 1 ? "s" : ""}
        </span>
        <button
          type="button"
          onClick={() => setEditingSection(!editingSection)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-100/80 hover:text-gray-600 transition-colors"
          title="Edit section"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
        <form action={handleDeleteSection}>
          <input type="hidden" name="sectionId" value={section.id} />
          <button
            type="submit"
            disabled={deletePending}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Delete section"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {deleteState.error && (
        <p className="mx-5 mb-2 text-xs text-red-600">{deleteState.error}</p>
      )}

      {/* Section edit form */}
      {editingSection && (
        <div className="mx-5 mb-4 p-4 rounded-lg bg-gray-50/80">
          <form
            action={updateAction}
            className="grid gap-3 md:grid-cols-[2fr_3fr_100px_auto]"
          >
            <input type="hidden" name="sectionId" value={section.id} />
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Title</label>
              <input
                name="title"
                defaultValue={section.title}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <input
                name="description"
                defaultValue={section.description || ""}
                placeholder="Section description"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Order</label>
              <input
                name="orderIndex"
                type="number"
                defaultValue={section.orderIndex}
                className={inputClass}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm" disabled={updatePending}>
                {updatePending ? "..." : "Save"}
              </Button>
            </div>
          </form>
          {updateState.error && (
            <p className="mt-2 text-xs text-red-600">{updateState.error}</p>
          )}
        </div>
      )}

      {/* Questions */}
      {expanded && (
        <div className="px-5 pb-5 space-y-3">
          {sectionQuestions.map((question, idx) => (
            <QuestionBlock key={question.id} question={question} index={idx} />
          ))}

          {/* Add question toggle */}
          {addingQuestion ? (
            <div className="p-4 rounded-lg bg-gray-50/60">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-gray-500">New question</p>
                <button
                  type="button"
                  onClick={() => setAddingQuestion(false)}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Cancel
                </button>
              </div>
              <form action={addQAction} className="grid gap-3 sm:grid-cols-2">
                <input type="hidden" name="sectionId" value={section.id} />
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Key</label>
                  <input
                    name="questionKey"
                    placeholder="e.g. company_name"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Prompt</label>
                  <input
                    name="prompt"
                    placeholder="The question text"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                  <input
                    name="description"
                    placeholder="Optional help text"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Input type</label>
                  <select name="inputType" defaultValue="text" className={inputClass}>
                    <option value="text">Text</option>
                    <option value="textarea">Textarea</option>
                    <option value="select">Select</option>
                    <option value="multi_select">Multi-select</option>
                    <option value="number">Number</option>
                    <option value="file_upload">File upload</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Domain</label>
                  <input
                    name="domain"
                    placeholder="e.g. legal, operations"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Options JSON</label>
                  <input
                    name="options"
                    placeholder='e.g. ["yes","no"]'
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Required</label>
                  <select name="required" defaultValue="true" className={inputClass}>
                    <option value="true">Required</option>
                    <option value="false">Optional</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Weight</label>
                  <input
                    name="weight"
                    type="number"
                    step="0.1"
                    defaultValue={1}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-500 mb-1 block">Order</label>
                  <input
                    name="orderIndex"
                    type="number"
                    defaultValue={sectionQuestions.length}
                    className={inputClass}
                  />
                </div>
                <div className="flex items-end">
                  <Button type="submit" size="sm" disabled={addQPending}>
                    {addQPending ? "Adding..." : "Add question"}
                  </Button>
                </div>
              </form>
              {addQState.error && (
                <p className="mt-2 text-xs text-red-600">{addQState.error}</p>
              )}
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setAddingQuestion(true)}
              className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-indigo-600 transition-colors py-2"
            >
              <Plus className="w-3.5 h-3.5" />
              Add question
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function QuestionBlock({ question, index }: { question: Question; index: number }) {
  const [editing, setEditing] = useState(false);

  const [updateState, updateAction, updatePending] = useActionState<
    ActionState,
    FormData
  >(updateAssessmentQuestion, { error: null });

  const [deleteState, deleteAction, deletePending] = useActionState<
    ActionState,
    FormData
  >(deleteAssessmentQuestion, { error: null });

  function handleDelete(formData: FormData) {
    if (!window.confirm("Delete this question? This cannot be undone.")) return;
    deleteAction(formData);
  }

  const domainClass = question.domain
    ? domainColors[question.domain.toLowerCase()] || "bg-gray-100/60 text-gray-600"
    : null;

  return (
    <div className="group rounded-lg bg-gray-50/40 hover:bg-gray-50/80 transition-colors">
      {/* Question header — always visible */}
      <div className="flex items-start gap-3 px-4 py-3">
        <span className="w-6 h-6 rounded-full bg-indigo-50/80 text-indigo-600 text-xs font-medium flex items-center justify-center flex-shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900">{question.prompt}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-xs text-gray-400">{question.questionKey}</span>
            <span className="text-xs text-gray-300">&middot;</span>
            <span className="text-xs text-gray-400">{question.inputType}</span>
            {question.required && (
              <>
                <span className="text-xs text-gray-300">&middot;</span>
                <span className="text-xs text-red-400">required</span>
              </>
            )}
            {domainClass && (
              <span className={cn("text-xs px-1.5 py-0.5 rounded-md font-medium", domainClass)}>
                {question.domain}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setEditing(!editing)}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-white hover:text-gray-600 transition-colors"
            title="Edit question"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <form action={handleDelete}>
            <input type="hidden" name="questionId" value={question.id} />
            <button
              type="submit"
              disabled={deletePending}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              title="Delete question"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {deleteState.error && (
        <p className="mx-4 mb-2 text-xs text-red-600">{deleteState.error}</p>
      )}

      {/* Expandable edit form */}
      {editing && (
        <div className="px-4 pb-4 pt-1">
          <form action={updateAction} className="grid gap-3 sm:grid-cols-2">
            <input type="hidden" name="questionId" value={question.id} />
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Key</label>
              <input
                name="questionKey"
                defaultValue={question.questionKey}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Prompt</label>
              <input
                name="prompt"
                defaultValue={question.prompt}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <input
                name="description"
                defaultValue={question.description || ""}
                placeholder="Help text"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Input type</label>
              <select
                name="inputType"
                defaultValue={question.inputType}
                className={inputClass}
              >
                <option value="text">Text</option>
                <option value="textarea">Textarea</option>
                <option value="select">Select</option>
                <option value="multi_select">Multi-select</option>
                <option value="number">Number</option>
                <option value="file_upload">File upload</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Domain</label>
              <input
                name="domain"
                defaultValue={question.domain || ""}
                placeholder="e.g. legal"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Options JSON</label>
              <input
                name="options"
                defaultValue={formatJson(question.options)}
                placeholder='e.g. ["yes","no"]'
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Required</label>
              <select
                name="required"
                defaultValue={question.required ? "true" : "false"}
                className={inputClass}
              >
                <option value="true">Required</option>
                <option value="false">Optional</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Weight</label>
              <input
                name="weight"
                type="number"
                step="0.1"
                defaultValue={question.weight}
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Order</label>
              <input
                name="orderIndex"
                type="number"
                defaultValue={question.orderIndex}
                className={inputClass}
              />
            </div>
            <div className="flex items-end gap-2">
              <Button type="submit" size="sm" disabled={updatePending}>
                {updatePending ? "Saving..." : "Save"}
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setEditing(false)}
              >
                Cancel
              </Button>
            </div>
          </form>
          {updateState.error && (
            <p className="mt-2 text-xs text-red-600">{updateState.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export function TemplateSectionsEditor({
  templateId,
  sections,
  questions,
}: TemplateSectionsEditorProps) {
  const [addingSection, setAddingSection] = useState(false);

  const [addState, addAction, addPending] = useActionState<
    ActionState,
    FormData
  >(createAssessmentSection, { error: null });

  const questionsBySection = new Map<string, Question[]>();
  for (const section of sections) {
    questionsBySection.set(
      section.id,
      questions.filter((q) => q.sectionId === section.id)
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Sections & Questions</h2>
          <p className="text-sm text-gray-400 mt-0.5">
            {sections.length} section{sections.length !== 1 ? "s" : ""}, {questions.length} question{questions.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Button
          size="sm"
          variant={addingSection ? "ghost" : "outline"}
          onClick={() => setAddingSection(!addingSection)}
        >
          {addingSection ? "Cancel" : (
            <>
              <Plus className="w-3.5 h-3.5" />
              Add section
            </>
          )}
        </Button>
      </div>

      {addingSection && (
        <div className="mb-8 p-4 rounded-xl bg-white/60">
          <p className="text-xs font-medium text-gray-500 mb-3">New section</p>
          <form
            action={addAction}
            className="grid gap-3 sm:grid-cols-[2fr_3fr_100px_auto]"
          >
            <input type="hidden" name="templateId" value={templateId} />
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Title</label>
              <input
                name="title"
                placeholder="Section title"
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
              <input
                name="description"
                placeholder="Section description"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-500 mb-1 block">Order</label>
              <input
                name="orderIndex"
                type="number"
                defaultValue={sections.length}
                className={inputClass}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" size="sm" disabled={addPending}>
                {addPending ? "Adding..." : "Add"}
              </Button>
            </div>
          </form>
          {addState.error && (
            <p className="mt-2 text-sm text-red-600">{addState.error}</p>
          )}
        </div>
      )}

      <div className="space-y-8">
        {sections.map((section) => (
          <SectionBlock
            key={section.id}
            section={section}
            sectionQuestions={questionsBySection.get(section.id) || []}
          />
        ))}
      </div>
    </div>
  );
}
