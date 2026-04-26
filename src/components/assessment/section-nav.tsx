"use client";

import { CheckCircle2 } from "lucide-react";
import type { Section, Question, Answers } from "./question-field";
import { shouldShow } from "./question-field";

interface SectionNavProps {
  sections: Section[];
  questions: Question[];
  answers: Answers;
  currentIndex: number;
  onNavigate: (index: number) => void;
}

function isSectionComplete(
  section: Section,
  questions: Question[],
  answers: Answers
): boolean {
  const sectionQs = questions
    .filter((q) => q.sectionId === section.id)
    .filter((q) => shouldShow(q, answers));
  return sectionQs
    .filter((q) => q.required)
    .every((q) => {
      const val = answers[q.questionKey];
      const fileVal = answers[`${q.questionKey}__file`];
      if (fileVal) return true;
      if (Array.isArray(val)) return val.length > 0;
      return !!val;
    });
}

export function SectionNav({
  sections,
  questions,
  answers,
  currentIndex,
  onNavigate,
}: SectionNavProps) {
  return (
    <nav className="hidden lg:block w-56 shrink-0">
      <div className="sticky top-28">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Sections
        </p>
        <ol className="space-y-1">
          {sections.map((section, idx) => {
            const isCurrent = idx === currentIndex;
            const isComplete = isSectionComplete(section, questions, answers);
            const isPast = idx < currentIndex;

            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => onNavigate(idx)}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                    isCurrent
                      ? "bg-indigo-50 text-indigo-700 font-medium"
                      : isPast || isComplete
                      ? "text-gray-600 hover:bg-gray-50"
                      : "text-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {isComplete || isPast ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  ) : isCurrent ? (
                    <span className="w-4 h-4 rounded-full border-2 border-indigo-500 flex items-center justify-center shrink-0">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                    </span>
                  ) : (
                    <span className="w-4 h-4 rounded-full border-2 border-gray-300 shrink-0" />
                  )}
                  <span className="truncate">{section.title}</span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>
    </nav>
  );
}
