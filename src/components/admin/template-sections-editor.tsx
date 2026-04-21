"use client";

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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50";

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

function SectionBlock({
  section,
  sectionQuestions,
}: {
  section: Section;
  sectionQuestions: Question[];
}) {
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
    <div className="rounded-xl border border-gray-100 p-4">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">
            {section.title}
          </h3>
          <p className="text-xs text-gray-500">Order: {section.orderIndex}</p>
        </div>
        <form action={handleDeleteSection}>
          <input type="hidden" name="sectionId" value={section.id} />
          <Button
            type="submit"
            size="sm"
            variant="danger"
            disabled={deletePending}
          >
            {deletePending ? "..." : "Delete section"}
          </Button>
        </form>
      </div>

      {deleteState.error && (
        <p className="mb-2 text-xs text-red-600">{deleteState.error}</p>
      )}

      <form
        action={updateAction}
        className="mb-4 grid gap-2 md:grid-cols-[2fr_3fr_120px_auto]"
      >
        <input type="hidden" name="sectionId" value={section.id} />
        <input
          name="title"
          defaultValue={section.title}
          required
          className={inputClass}
        />
        <input
          name="description"
          defaultValue={section.description || ""}
          placeholder="Description"
          className={inputClass}
        />
        <input
          name="orderIndex"
          type="number"
          defaultValue={section.orderIndex}
          className={inputClass}
        />
        <Button type="submit" variant="outline" disabled={updatePending}>
          {updatePending ? "..." : "Save section"}
        </Button>
      </form>
      {updateState.error && (
        <p className="mb-2 text-xs text-red-600">{updateState.error}</p>
      )}

      <div className="space-y-3 border-t border-gray-100 pt-4">
        <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
          Questions ({sectionQuestions.length})
        </p>

        <form
          action={addQAction}
          className="grid gap-2 md:grid-cols-2"
        >
          <input type="hidden" name="sectionId" value={section.id} />
          <input
            name="questionKey"
            placeholder="Question key"
            required
            className={inputClass}
          />
          <input
            name="prompt"
            placeholder="Prompt"
            required
            className={inputClass}
          />
          <input
            name="description"
            placeholder="Description"
            className={inputClass}
          />
          <input
            name="inputType"
            placeholder="Input type (text, select, number...)"
            defaultValue="text"
            className={inputClass}
          />
          <input
            name="domain"
            placeholder="Domain (e.g. legal, operations)"
            className={inputClass}
          />
          <input
            name="options"
            placeholder='Options JSON (e.g. ["yes","no"])'
            className={inputClass}
          />
          <select name="required" defaultValue="true" className={inputClass}>
            <option value="true">required</option>
            <option value="false">optional</option>
          </select>
          <input
            name="weight"
            type="number"
            step="0.1"
            defaultValue={1}
            className={inputClass}
          />
          <input
            name="orderIndex"
            type="number"
            defaultValue={sectionQuestions.length}
            className={inputClass}
          />
          <Button type="submit" disabled={addQPending}>
            {addQPending ? "Adding\u2026" : "Add question"}
          </Button>
        </form>
        {addQState.error && (
          <p className="text-xs text-red-600">{addQState.error}</p>
        )}

        <div className="space-y-3">
          {sectionQuestions.map((question) => (
            <QuestionBlock key={question.id} question={question} />
          ))}
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({ question }: { question: Question }) {
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

  return (
    <div className="rounded-lg border border-gray-100 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-gray-900">{question.prompt}</p>
          <p className="text-xs text-gray-500">
            {question.questionKey} &bull; {question.inputType}
          </p>
        </div>
        <form action={handleDelete}>
          <input type="hidden" name="questionId" value={question.id} />
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

      {deleteState.error && (
        <p className="mb-2 text-xs text-red-600">{deleteState.error}</p>
      )}

      <form action={updateAction} className="grid gap-2 md:grid-cols-2">
        <input type="hidden" name="questionId" value={question.id} />
        <input
          name="questionKey"
          defaultValue={question.questionKey}
          required
          className={inputClass}
        />
        <input
          name="prompt"
          defaultValue={question.prompt}
          required
          className={inputClass}
        />
        <input
          name="description"
          defaultValue={question.description || ""}
          placeholder="Description"
          className={inputClass}
        />
        <input
          name="inputType"
          defaultValue={question.inputType}
          className={inputClass}
        />
        <input
          name="domain"
          defaultValue={question.domain || ""}
          placeholder="Domain"
          className={inputClass}
        />
        <input
          name="options"
          defaultValue={formatJson(question.options)}
          placeholder="Options JSON"
          className={inputClass}
        />
        <select
          name="required"
          defaultValue={question.required ? "true" : "false"}
          className={inputClass}
        >
          <option value="true">required</option>
          <option value="false">optional</option>
        </select>
        <input
          name="weight"
          type="number"
          step="0.1"
          defaultValue={question.weight}
          className={inputClass}
        />
        <input
          name="orderIndex"
          type="number"
          defaultValue={question.orderIndex}
          className={inputClass}
        />
        <Button type="submit" variant="outline" disabled={updatePending}>
          {updatePending ? "Saving\u2026" : "Save question"}
        </Button>
      </form>
      {updateState.error && (
        <p className="mt-1 text-xs text-red-600">{updateState.error}</p>
      )}
    </div>
  );
}

export function TemplateSectionsEditor({
  templateId,
  sections,
  questions,
}: TemplateSectionsEditorProps) {
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
    <Card>
      <CardHeader>
        <CardTitle>Sections and questions</CardTitle>
        <CardDescription>
          Structure the assessment and manage all section prompts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <form
          action={addAction}
          className="grid gap-3 md:grid-cols-[2fr_3fr_140px_auto]"
        >
          <input type="hidden" name="templateId" value={templateId} />
          <input
            name="title"
            placeholder="Section title"
            required
            className={inputClass}
          />
          <input
            name="description"
            placeholder="Section description"
            className={inputClass}
          />
          <input
            name="orderIndex"
            type="number"
            defaultValue={sections.length}
            className={inputClass}
          />
          <Button type="submit" disabled={addPending}>
            {addPending ? "Adding\u2026" : "Add section"}
          </Button>
        </form>
        {addState.error && (
          <p className="text-sm text-red-600">{addState.error}</p>
        )}

        <div className="space-y-6">
          {sections.map((section) => (
            <SectionBlock
              key={section.id}
              section={section}
              sectionQuestions={questionsBySection.get(section.id) || []}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
