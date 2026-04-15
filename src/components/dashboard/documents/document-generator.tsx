"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { templates, getTemplate } from "@/lib/documents/templates";
import type { DocumentTemplate } from "@/lib/documents/templates";
import {
  FileText,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Download,
  AlertTriangle,
  Sparkles,
} from "lucide-react";

interface GeneratedDoc {
  id: string;
  name: string;
  content: string;
  type: string;
  createdAt: string;
}

interface RecommendedDoc {
  issueId: string;
  issueTitle: string;
  severity: string;
  templateId: string;
  templateName: string;
}

interface StartupContext {
  name: string;
  jurisdiction: string | null;
  stage: string | null;
}

/** Map stored jurisdiction values to template jurisdiction option values */
const jurisdictionMap: Record<string, string> = {
  us_delaware: "delaware",
  us_other: "california",
  uk: "england_wales",
  nigeria: "nigeria",
  singapore: "singapore",
};

const categoryLabels: Record<string, string> = {
  contracts: "Contracts",
  incorporation: "Incorporation",
  equity: "Equity",
  employment: "Employment",
  ip: "Intellectual Property",
  data_privacy: "Data & Privacy",
};

const severityColors: Record<string, string> = {
  critical: "text-red-600 bg-red-50 border-red-200",
  high: "text-amber-600 bg-amber-50 border-amber-200",
  medium: "text-blue-600 bg-blue-50 border-blue-200",
};

function RecommendedSection({
  recommended,
  onSelect,
}: {
  recommended: RecommendedDoc[];
  onSelect: (template: DocumentTemplate) => void;
}) {
  if (recommended.length === 0) return null;

  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-600" />
        <h3 className="text-sm font-semibold text-gray-900">Recommended for You</h3>
        <Badge variant="info">{recommended.length} missing</Badge>
      </div>
      <p className="text-xs text-gray-500 mb-4">
        These documents were flagged as missing in your legal health check. Generate them to improve your score.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {recommended.map((rec) => {
          const template = getTemplate(rec.templateId);
          if (!template) return null;
          return (
            <Card
              key={rec.issueId}
              className="cursor-pointer border-indigo-100 bg-indigo-50/30 hover:border-indigo-300 hover:shadow-md transition-all"
              onClick={() => onSelect(template)}
            >
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-100 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-gray-900 truncate">{template.name}</h4>
                      <span className={`text-xs font-medium px-1.5 py-0.5 rounded border ${severityColors[rec.severity] || "text-gray-600 bg-gray-50 border-gray-200"}`}>
                        {rec.severity}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{rec.issueTitle}</p>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

function TemplateSelector({
  onSelect,
  recommended,
}: {
  onSelect: (template: DocumentTemplate) => void;
  recommended: RecommendedDoc[];
}) {
  const recommendedIds = new Set(recommended.map((r) => r.templateId));
  const otherTemplates = templates.filter((t) => !recommendedIds.has(t.id));

  // Group by category
  const grouped: Record<string, DocumentTemplate[]> = {};
  for (const t of otherTemplates) {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  }

  return (
    <div>
      <RecommendedSection recommended={recommended} onSelect={onSelect} />

      {Object.entries(grouped).map(([category, categoryTemplates]) => (
        <div key={category} className="mb-6">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
            {categoryLabels[category] || category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryTemplates.map((t) => (
              <Card
                key={t.id}
                className="cursor-pointer hover:border-indigo-200 hover:shadow-md transition-all"
                onClick={() => onSelect(t)}
              >
                <div className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-gray-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-900 mb-0.5">{t.name}</h4>
                      <p className="text-xs text-gray-500 line-clamp-2">{t.description}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function InputForm({
  template,
  onBack,
  onGenerate,
  prefill,
}: {
  template: DocumentTemplate;
  onBack: () => void;
  onGenerate: (fields: Record<string, string>) => void;
  prefill?: Record<string, string>;
}) {
  const [fields, setFields] = useState<Record<string, string>>(prefill || {});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = () => {
    const newErrors: Record<string, string> = {};
    for (const field of template.fields) {
      if (field.required && !fields[field.id]?.trim()) {
        newErrors[field.id] = `${field.label} is required`;
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    onGenerate(fields);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <CardTitle>{template.name}</CardTitle>
            <CardDescription>Fill in the details to generate your document</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {template.fields.map((field) => (
            <div key={field.id}>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                {field.label}
                {field.required && <span className="text-red-500 ml-0.5">*</span>}
              </label>
              {field.type === "text" && (
                <input
                  type="text"
                  value={fields[field.id] || ""}
                  onChange={(e) => {
                    setFields((p) => ({ ...p, [field.id]: e.target.value }));
                    setErrors((p) => ({ ...p, [field.id]: "" }));
                  }}
                  placeholder={field.placeholder}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                />
              )}
              {field.type === "date" && (
                <input
                  type="date"
                  value={fields[field.id] || ""}
                  onChange={(e) => {
                    setFields((p) => ({ ...p, [field.id]: e.target.value }));
                    setErrors((p) => ({ ...p, [field.id]: "" }));
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                />
              )}
              {field.type === "select" && (
                <select
                  value={fields[field.id] || ""}
                  onChange={(e) => {
                    setFields((p) => ({ ...p, [field.id]: e.target.value }));
                    setErrors((p) => ({ ...p, [field.id]: "" }));
                  }}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 bg-white"
                >
                  <option value="">Select...</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
              {field.type === "textarea" && (
                <textarea
                  value={fields[field.id] || ""}
                  onChange={(e) => {
                    setFields((p) => ({ ...p, [field.id]: e.target.value }));
                    setErrors((p) => ({ ...p, [field.id]: "" }));
                  }}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none"
                />
              )}
              {errors[field.id] && (
                <p className="text-xs text-red-500 mt-1">{errors[field.id]}</p>
              )}
            </div>
          ))}
          <div className="flex justify-end pt-2">
            <Button onClick={handleSubmit}>
              Generate Document
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DocumentViewer({
  doc,
  onBack,
}: {
  doc: GeneratedDoc;
  onBack: () => void;
}) {
  const handleDownload = () => {
    const blob = new Blob([doc.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${doc.name.replace(/[^a-zA-Z0-9]/g, "_")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-sm font-semibold text-gray-900">{doc.name}</h2>
            <p className="text-xs text-gray-400">{doc.type} · Generated just now</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={handleDownload}>
          <Download className="w-3.5 h-3.5" />
          Download
        </Button>
      </div>
      <Card>
        <CardContent className="p-6">
          <div className="prose prose-sm max-w-none text-gray-800 [&_h2]:text-base [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-2 [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:mt-4 [&_p]:text-sm [&_p]:leading-relaxed [&_li]:text-sm">
            {doc.content.split("\n").map((line, i) => {
              if (line.startsWith("## "))
                return <h2 key={i}>{line.replace("## ", "")}</h2>;
              if (line.startsWith("### "))
                return <h3 key={i}>{line.replace("### ", "")}</h3>;
              if (line.startsWith("- "))
                return (
                  <li key={i} className="ml-4 list-disc">
                    {line.replace("- ", "")}
                  </li>
                );
              if (line.startsWith("**") && line.endsWith("**"))
                return (
                  <p key={i} className="font-semibold">
                    {line.replace(/\*\*/g, "")}
                  </p>
                );
              if (line.trim() === "") return <br key={i} />;
              return <p key={i}>{line}</p>;
            })}
          </div>
        </CardContent>
      </Card>
      <div className="mt-4 p-3 bg-amber-50 border border-amber-100 rounded-lg">
        <p className="text-xs text-amber-700">
          This document was AI-generated and should be reviewed by a qualified legal professional before execution. Orion does not provide legal advice.
        </p>
      </div>
    </div>
  );
}

export default function DocumentGenerator({
  onDocGenerated,
}: {
  onDocGenerated?: () => void;
}) {
  const [step, setStep] = useState<"select" | "input" | "generating" | "view">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [generatedDoc, setGeneratedDoc] = useState<GeneratedDoc | null>(null);
  const [error, setError] = useState("");
  const [recommended, setRecommended] = useState<RecommendedDoc[]>([]);
  const [startupCtx, setStartupCtx] = useState<StartupContext | null>(null);

  useEffect(() => {
    fetch("/api/documents/recommended")
      .then((res) => res.json())
      .then((data) => {
        setRecommended(data.recommended || []);
        if (data.startup) setStartupCtx(data.startup);
      })
      .catch(() => {});
  }, []);

  const handleGenerate = async (fields: Record<string, string>) => {
    if (!selectedTemplate) return;
    setStep("generating");
    setError("");

    try {
      const res = await fetch("/api/documents/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ templateId: selectedTemplate.id, fields }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Generation failed");
      }

      const doc = await res.json();
      setGeneratedDoc(doc);
      setStep("view");
      onDocGenerated?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("input");
    }
  };

  if (step === "generating") {
    return (
      <Card>
        <div className="p-12 flex flex-col items-center justify-center text-center">
          <Loader2 className="w-8 h-8 text-indigo-500 animate-spin mb-4" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">
            Generating your {selectedTemplate?.name}...
          </h3>
          <p className="text-xs text-gray-500">This usually takes 10-20 seconds</p>
        </div>
      </Card>
    );
  }

  if (step === "view" && generatedDoc) {
    return (
      <DocumentViewer
        doc={generatedDoc}
        onBack={() => {
          setStep("select");
          setSelectedTemplate(null);
          setGeneratedDoc(null);
        }}
      />
    );
  }

  if (step === "input" && selectedTemplate) {
    // Build prefill from startup context
    const prefill: Record<string, string> = {};
    if (startupCtx) {
      // Prefill company name fields
      for (const field of selectedTemplate.fields) {
        if (
          field.id === "company_name" ||
          field.id === "disclosing_party" ||
          field.id === "controller_name"
        ) {
          prefill[field.id] = startupCtx.name;
        }
        if (field.id === "jurisdiction" && startupCtx.jurisdiction) {
          const mapped = jurisdictionMap[startupCtx.jurisdiction];
          if (mapped) prefill[field.id] = mapped;
        }
      }
    }

    return (
      <div>
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}
        <InputForm
          template={selectedTemplate}
          onBack={() => {
            setStep("select");
            setSelectedTemplate(null);
          }}
          onGenerate={handleGenerate}
          prefill={prefill}
        />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-base font-semibold text-gray-900 mb-1">Generate a Document</h2>
        <p className="text-sm text-gray-500">
          Choose a template and fill in the details. Our AI will generate a professional legal document.
        </p>
      </div>
      <TemplateSelector
        onSelect={(t) => {
          setSelectedTemplate(t);
          setStep("input");
        }}
        recommended={recommended}
      />
    </div>
  );
}
