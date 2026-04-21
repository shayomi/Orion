"use client";

import { useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";

// ─── Types ──────────────────────────────────────────────

interface Section {
  id: string;
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
  options: Record<string, unknown> | null;
  domain: string | null;
  required: boolean;
  weight: number;
  orderIndex: number;
}

interface OnboardingAssessmentProps {
  template: { id: string; name: string; description: string | null };
  sections: Section[];
  questions: Question[];
}

type Answers = Record<string, string | string[]>;

// ─── Helpers ────────────────────────────────────────────

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 placeholder:text-gray-400";

function getChoices(options: Record<string, unknown> | null): string[] {
  if (!options) return [];
  if (Array.isArray(options.choices)) return options.choices as string[];
  return [];
}

function getShowIf(
  options: Record<string, unknown> | null
): { questionKey: string; equals?: string; notEquals?: string; includes?: string } | null {
  if (!options || !options.showIf) return null;
  return options.showIf as { questionKey: string; equals?: string; notEquals?: string; includes?: string };
}

function shouldShow(question: Question, answers: Answers): boolean {
  const showIf = getShowIf(question.options);
  if (!showIf) return true;

  const val = answers[showIf.questionKey];
  if (showIf.equals) {
    if (Array.isArray(val)) return val.includes(showIf.equals);
    return val === showIf.equals;
  }
  if (showIf.notEquals) {
    if (Array.isArray(val)) return !val.includes(showIf.notEquals);
    return val !== showIf.notEquals;
  }
  if (showIf.includes) {
    if (Array.isArray(val)) return val.includes(showIf.includes);
    return val === showIf.includes;
  }
  return true;
}

// ─── Question field ─────────────────────────────────────

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (key: string, val: string | string[]) => void;
}) {
  const choices = getChoices(question.options);

  if (question.inputType === "select" && choices.length > 0) {
    return (
      <div className="space-y-2">
        {choices.map((choice) => {
          const selected = value === choice;
          return (
            <button
              key={choice}
              type="button"
              onClick={() => onChange(question.questionKey, choice)}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
                selected
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              {choice}
            </button>
          );
        })}
      </div>
    );
  }

  if (question.inputType === "multi_select" && choices.length > 0) {
    const selected = Array.isArray(value) ? value : [];
    return (
      <div className="space-y-2">
        {choices.map((choice) => {
          const isSelected = selected.includes(choice);
          return (
            <button
              key={choice}
              type="button"
              onClick={() => {
                const next = isSelected
                  ? selected.filter((c) => c !== choice)
                  : [...selected, choice];
                onChange(question.questionKey, next);
              }}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all flex items-center gap-3 ${
                isSelected
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div
                className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
                  isSelected
                    ? "bg-indigo-600 border-indigo-600"
                    : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                )}
              </div>
              <span className={isSelected ? "text-indigo-700 font-medium" : "text-gray-600"}>
                {choice}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.inputType === "textarea") {
    return (
      <textarea
        value={typeof value === "string" ? value : ""}
        onChange={(e) => onChange(question.questionKey, e.target.value)}
        rows={4}
        placeholder="Enter your response..."
        className={inputClass}
      />
    );
  }

  return (
    <input
      type="text"
      value={typeof value === "string" ? value : ""}
      onChange={(e) => onChange(question.questionKey, e.target.value)}
      placeholder="Enter your response..."
      className={inputClass}
    />
  );
}

// ─── Main component ─────────────────────────────────────

export function OnboardingAssessment({
  template,
  sections,
  questions,
}: OnboardingAssessmentProps) {
  const router = useRouter();
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const questionsBySection = useMemo(() => {
    const map = new Map<string, Question[]>();
    for (const s of sections) {
      map.set(s.id, questions.filter((q) => q.sectionId === s.id));
    }
    return map;
  }, [sections, questions]);

  const currentSection = sections[currentSectionIdx];
  const currentQuestions = currentSection
    ? (questionsBySection.get(currentSection.id) ?? [])
    : [];
  const visibleQuestions = currentQuestions.filter((q) => shouldShow(q, answers));

  const handleChange = useCallback((key: string, val: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [key]: val }));
  }, []);

  const sectionComplete = visibleQuestions
    .filter((q) => q.required)
    .every((q) => {
      const val = answers[q.questionKey];
      if (Array.isArray(val)) return val.length > 0;
      return !!val;
    });

  const totalSections = sections.length;
  const progressPercent = submitting
    ? 100
    : ((currentSectionIdx + (sectionComplete ? 1 : 0.5)) / totalSections) * 100;

  const allVisibleQuestions = questions.filter((q) => shouldShow(q, answers));
  const answeredCount = allVisibleQuestions.filter((q) => {
    const val = answers[q.questionKey];
    if (Array.isArray(val)) return val.length > 0;
    return !!val;
  }).length;

  const handleNext = () => {
    if (currentSectionIdx < totalSections - 1) {
      setCurrentSectionIdx((i) => i + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentSectionIdx > 0) {
      setCurrentSectionIdx((i) => i - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
      // 1. Run AI health check
      const res = await fetch("/api/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: template.id, answers }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Assessment failed");
      }

      const result = await res.json();

      // 2. Persist to user's account
      const persistRes = await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          templateId: template.id,
          answers,
          result,
        }),
      });

      if (!persistRes.ok) {
        const err = await persistRes.json();
        throw new Error(err.error || "Failed to save results");
      }

      // 3. Redirect to dashboard
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  // Submitting state
  if (submitting) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Analysing your responses...
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Our AI is reviewing your legal health across all domains to build
            your personalised dashboard.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            This usually takes 15-30 seconds
          </div>
        </div>
      </div>
    );
  }

  const isLastSection = currentSectionIdx === totalSections - 1;

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                Legal Health Check
              </span>
            </div>
            <Badge variant="info">
              Section {currentSectionIdx + 1} of {totalSections}
            </Badge>
          </div>
          <Progress value={progressPercent} />
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-gray-400">
              {answeredCount} of {allVisibleQuestions.length} questions answered
            </p>
            <p className="text-xs text-gray-400">
              {Math.round(progressPercent)}%
            </p>
          </div>
        </div>
      </div>

      {/* Section content */}
      <div className="max-w-2xl mx-auto px-6 pb-32">
        <Card className="mt-6">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-900">
                {currentSection.title}
              </h2>
              {currentSection.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {currentSection.description}
                </p>
              )}
            </div>

            <div className="space-y-8">
              {visibleQuestions.map((question, qi) => (
                <div key={question.id}>
                  <div className="mb-3">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-medium text-gray-400 mt-0.5 shrink-0">
                        {qi + 1}.
                      </span>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {question.prompt}
                          {question.required && (
                            <span className="text-red-400 ml-1">*</span>
                          )}
                        </p>
                        {question.description && (
                          <p className="text-xs text-gray-500 mt-1">
                            {question.description}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-5">
                    <QuestionField
                      question={question}
                      value={answers[question.questionKey]}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              ))}
            </div>

            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Footer nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={currentSectionIdx === 0}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>

          {isLastSection ? (
            <Button onClick={handleSubmit} disabled={!sectionComplete}>
              <Sparkles className="w-4 h-4" />
              Submit & Build Dashboard
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!sectionComplete}>
              Next Section
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
