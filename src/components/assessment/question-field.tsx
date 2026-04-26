"use client";

import { useState } from "react";
import { CheckCircle2, Upload, X, Loader2, FileText, Paperclip } from "lucide-react";

// ─── Types ──────────────────────────────────────────────

export interface Section {
  id: string;
  title: string;
  description: string | null;
  orderIndex: number;
}

export interface Question {
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

export type Answers = Record<string, string | string[]>;

export type UploadValue = { uploadId: string; fileName: string; storageKey: string };

// ─── Helpers ────────────────────────────────────────────

export function getChoices(options: Record<string, unknown> | null): string[] {
  if (!options) return [];
  if (Array.isArray(options.choices)) return options.choices as string[];
  return [];
}

export function getShowIf(
  options: Record<string, unknown> | null
): { questionKey: string; equals?: string; notEquals?: string; includes?: string } | null {
  if (!options || !options.showIf) return null;
  return options.showIf as { questionKey: string; equals?: string; notEquals?: string; includes?: string };
}

export function shouldShow(question: Question, answers: Answers): boolean {
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

/** Check if a question should show a file attachment option */
function shouldShowAttachment(question: Question): boolean {
  // Explicit flag in options
  if (question.options?.allowAttachment) return true;
  // Detect from description keywords
  if (!question.description) return false;
  const desc = question.description.toLowerCase();
  const attachKeywords = [
    "upload", "attach", "provide details and evidence",
    "provide access", "share link", "upload/share",
    "upload or provide", "upload copies", "upload registration",
    "upload your", "upload or link",
  ];
  return attachKeywords.some((kw) => desc.includes(kw));
}

const inputClass =
  "w-full rounded-lg border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400 transition-all";

// ─── Domain colours ─────────────────────────────────────

const DOMAIN_COLORS: Record<string, string> = {
  incorporation: "bg-blue-50 text-blue-700",
  equity: "bg-purple-50 text-purple-700",
  ip: "bg-amber-50 text-amber-700",
  tax: "bg-emerald-50 text-emerald-700",
  compliance: "bg-rose-50 text-rose-700",
  contracts: "bg-cyan-50 text-cyan-700",
  governance: "bg-indigo-50 text-indigo-700",
  litigation: "bg-red-50 text-red-700",
  fundraising: "bg-violet-50 text-violet-700",
  data_protection: "bg-teal-50 text-teal-700",
  regulatory: "bg-orange-50 text-orange-700",
};

function domainBadgeClass(domain: string | null): string {
  if (!domain) return "bg-gray-50 text-gray-600";
  const lower = domain.toLowerCase().replace(/[\s-]+/g, "_");
  for (const [key, cls] of Object.entries(DOMAIN_COLORS)) {
    if (lower.includes(key)) return cls;
  }
  return "bg-gray-50 text-gray-600";
}

// ─── File Upload Field ──────────────────────────────────

function FileUploadField({
  question,
  value,
  onChange,
  assessmentId,
  compact = false,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (key: string, val: string | string[]) => void;
  assessmentId?: string;
  compact?: boolean;
}) {
  // The attachment answer is stored under a separate key: `{questionKey}__file`
  const answerKey = compact ? `${question.questionKey}__file` : question.questionKey;
  const rawValue = compact ? value : value;

  const parsed: UploadValue | null = (() => {
    if (!rawValue || typeof rawValue !== "string") return null;
    try {
      return JSON.parse(rawValue) as UploadValue;
    } catch {
      return null;
    }
  })();

  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleFile = async (file: File) => {
    setUploading(true);
    setUploadError("");
    setProgress(10);

    try {
      // Upload via FormData — server proxies to R2 (avoids CORS)
      const formData = new FormData();
      formData.append("file", file);
      if (question.domain) formData.append("domain", question.domain);
      if (assessmentId) formData.append("assessmentId", assessmentId);
      formData.append("questionKey", question.questionKey);

      setProgress(30);

      const res = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Upload failed");
      }

      const { uploadId, storageKey, fileName: savedName } = await res.json();
      setProgress(100);

      onChange(
        answerKey,
        JSON.stringify({ uploadId, fileName: savedName || file.name, storageKey })
      );
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(answerKey, "");
    setProgress(0);
  };

  if (parsed) {
    return (
      <div className="flex items-center gap-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
        <FileText className="w-5 h-5 text-emerald-600 shrink-0" />
        <span className="text-sm text-emerald-800 font-medium flex-1 truncate">
          {parsed.fileName}
        </span>
        <button
          type="button"
          onClick={handleRemove}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  if (compact) {
    return (
      <div>
        <label
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all text-sm ${
            uploading
              ? "bg-indigo-50 text-indigo-600"
              : "bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          }`}
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Uploading... {progress}%</span>
            </>
          ) : (
            <>
              <Paperclip className="w-4 h-4" />
              <span>Attach supporting document</span>
            </>
          )}
          <input
            type="file"
            className="hidden"
            accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.md,.xls,.xlsx,.csv"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            disabled={uploading}
          />
        </label>
        {uploading && (
          <div className="w-48 bg-gray-200 rounded-full h-1 mt-2">
            <div
              className="bg-indigo-600 h-1 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        {uploadError && (
          <p className="text-xs text-red-500 mt-1">{uploadError}</p>
        )}
      </div>
    );
  }

  return (
    <div>
      <label
        className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-all ${
          uploading
            ? "border-indigo-300 bg-indigo-50/50"
            : "border-gray-200 hover:border-indigo-300 hover:bg-gray-50"
        }`}
      >
        {uploading ? (
          <>
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            <span className="text-sm text-indigo-600">Uploading... {progress}%</span>
            <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5 mt-1">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-gray-400" />
            <span className="text-sm text-gray-500">
              Click to upload or drag and drop
            </span>
            <span className="text-xs text-gray-400">
              PDF, DOCX, PNG, JPG up to 10MB
            </span>
          </>
        )}
        <input
          type="file"
          className="hidden"
          accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.txt,.md,.xls,.xlsx,.csv"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
          }}
          disabled={uploading}
        />
      </label>
      {uploadError && (
        <p className="text-xs text-red-500 mt-2">{uploadError}</p>
      )}
    </div>
  );
}

// ─── Main QuestionField component ───────────────────────

export function QuestionField({
  question,
  value,
  onChange,
  assessmentId,
}: {
  question: Question;
  value: string | string[] | undefined;
  onChange: (key: string, val: string | string[]) => void;
  assessmentId?: string;
}) {
  const choices = getChoices(question.options);

  if (question.inputType === "file_upload") {
    return (
      <FileUploadField
        question={question}
        value={value}
        onChange={onChange}
        assessmentId={assessmentId}
      />
    );
  }

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
                  ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium ring-1 ring-indigo-500"
                  : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              <span className="flex items-center gap-3">
                <span
                  className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                    selected ? "border-indigo-600" : "border-gray-300"
                  }`}
                >
                  {selected && <span className="w-2 h-2 rounded-full bg-indigo-600" />}
                </span>
                {choice}
              </span>
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
                  ? "border-indigo-500 bg-indigo-50 ring-1 ring-indigo-500"
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
        className={inputClass + " resize-none"}
      />
    );
  }

  // Default: text input
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

// ─── Question Card (wraps QuestionField with label + numbering) ──

export function QuestionCard({
  question,
  index,
  value,
  onChange,
  assessmentId,
  attachmentValue,
}: {
  question: Question;
  index: number;
  value: string | string[] | undefined;
  onChange: (key: string, val: string | string[]) => void;
  assessmentId?: string;
  attachmentValue?: string | string[] | undefined;
}) {
  const showAttachment = shouldShowAttachment(question) && question.inputType !== "file_upload";

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md">
      <div className="mb-4">
        <div className="flex items-start gap-3">
          <span className="w-7 h-7 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
            {index}
          </span>
          <div className="flex-1 min-w-0">
            <div className="flex items-start gap-2 flex-wrap">
              <p className="text-base font-medium text-gray-900 leading-snug">
                {question.prompt}
                {question.required && (
                  <span className="text-red-400 ml-1">*</span>
                )}
              </p>
            </div>
            {question.description && (
              <p className="text-sm text-gray-500 mt-1.5 leading-relaxed">
                {question.description}
              </p>
            )}
            {question.domain && (
              <span
                className={`inline-block mt-2 text-xs font-medium px-2 py-0.5 rounded-full ${domainBadgeClass(question.domain)}`}
              >
                {question.domain}
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="ml-10 space-y-3">
        <QuestionField
          question={question}
          value={value}
          onChange={onChange}
          assessmentId={assessmentId}
        />
        {showAttachment && (
          <FileUploadField
            question={question}
            value={attachmentValue}
            onChange={onChange}
            assessmentId={assessmentId}
            compact
          />
        )}
      </div>
    </div>
  );
}
