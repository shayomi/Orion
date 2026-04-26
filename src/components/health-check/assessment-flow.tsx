"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  type Section,
  type Question,
  type Answers,
  shouldShow,
  QuestionCard,
} from "@/components/assessment/question-field";
import { SectionNav } from "@/components/assessment/section-nav";

// ─── Types ──────────────────────────────────────────────

interface AssessmentFlowProps {
  template: { id: string; name: string; description: string | null };
  sections: Section[];
  questions: Question[];
}

// ─── Main flow ──────────────────────────────────────────

export function AssessmentFlow({
  template,
  sections,
  questions,
}: AssessmentFlowProps) {
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [assessmentId, setAssessmentId] = useState<string | undefined>();

  // Start or resume an in-progress assessment
  useEffect(() => {
    fetch("/api/assessments/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ templateId: template.id }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.assessmentId) setAssessmentId(data.assessmentId);
      })
      .catch(() => {
        // Guest flow — generate a local ID for upload keying
        setAssessmentId(`guest_${crypto.randomUUID()}`);
      });
  }, [template.id]);

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

  const handleChange = useCallback(
    (key: string, val: string | string[]) => {
      setAnswers((prev) => ({ ...prev, [key]: val }));
    },
    []
  );

  const sectionComplete = visibleQuestions
    .filter((q) => q.required)
    .every((q) => {
      const val = answers[q.questionKey];
      const fileVal = answers[`${q.questionKey}__file`];
      // A file attachment counts as answering the question
      if (fileVal) return true;
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
    const fileVal = answers[`${q.questionKey}__file`];
    if (fileVal) return true;
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

  const handleNavigate = (idx: number) => {
    setCurrentSectionIdx(idx);
    window.scrollTo(0, 0);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError("");

    try {
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
      localStorage.setItem("orion_health_check", JSON.stringify(result));
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setSubmitting(false);
    }
  };

  // ─── Success state ──────────────────────────────────

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#fafafa] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-50 mb-6">
            <CheckCircle2 className="w-8 h-8 text-emerald-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Assessment Complete
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Your legal health check has been submitted. You answered{" "}
            {answeredCount} of {allVisibleQuestions.length} questions across{" "}
            {totalSections} sections.
          </p>
          <a
            href="/health-check/results"
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
          >
            View Results
          </a>
        </div>
      </div>
    );
  }

  // ─── Submitting state ───────────────────────────────

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
            Our AI is reviewing your legal health across all domains.
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
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">O</span>
              </div>
              <span className="text-sm font-semibold text-gray-900">
                {template.name}
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

      {/* Content with section nav */}
      <div className="max-w-4xl mx-auto px-6 pb-32">
        <div className="flex gap-8 mt-6">
          <SectionNav
            sections={sections}
            questions={questions}
            answers={answers}
            currentIndex={currentSectionIdx}
            onNavigate={handleNavigate}
          />

          <div className="flex-1 min-w-0">
            {/* Section header */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentSection.title}
              </h2>
              {currentSection.description && (
                <div className="mt-2 pl-4 border-l-2 border-indigo-200">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {currentSection.description}
                  </p>
                </div>
              )}
            </div>

            {/* Questions */}
            <div className="space-y-5">
              {visibleQuestions.map((question, qi) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={qi + 1}
                  value={answers[question.questionKey]}
                  onChange={handleChange}
                  assessmentId={assessmentId}
                  attachmentValue={answers[`${question.questionKey}__file`]}
                />
              ))}
            </div>

            {error && (
              <div className="mt-6 p-3 bg-red-50 border border-red-100 rounded-lg">
                <p className="text-sm text-red-600">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
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
              Submit Assessment
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
