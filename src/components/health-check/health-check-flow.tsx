"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  stageOptions,
  jurisdictionOptions,
  cofounderOptions,
  employeeOptions,
  industryOptions,
  getRelevantDocuments,
} from "@/lib/health-check/questions";
import type { ProfileData } from "@/lib/health-check/types";
import {
  Building2,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Sparkles,
} from "lucide-react";

function OptionButton({
  selected,
  label,
  onClick,
}: {
  selected: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${
        selected
          ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-medium"
          : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}

function ProfileStep({
  profile,
  onChange,
}: {
  profile: Partial<ProfileData>;
  onChange: (updates: Partial<ProfileData>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">What stage is your startup?</p>
        <div className="space-y-2">
          {stageOptions.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={profile.stage === opt.value}
              label={opt.label}
              onClick={() => onChange({ stage: opt.value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">Where is your company based?</p>
        <div className="space-y-2">
          {jurisdictionOptions.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={profile.jurisdiction === opt.value}
              label={opt.label}
              onClick={() => onChange({ jurisdiction: opt.value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">How many co-founders?</p>
        <div className="space-y-2">
          {cofounderOptions.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={profile.cofounders === opt.value}
              label={opt.label}
              onClick={() => onChange({ cofounders: opt.value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">Do you have employees or contractors?</p>
        <div className="space-y-2">
          {employeeOptions.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={profile.employees === opt.value}
              label={opt.label}
              onClick={() => onChange({ employees: opt.value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">What industry?</p>
        <div className="space-y-2">
          {industryOptions.map((opt) => (
            <OptionButton
              key={opt.value}
              selected={profile.industry === opt.value}
              label={opt.label}
              onClick={() => onChange({ industry: opt.value })}
            />
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-gray-900 mb-2">Quick questions</p>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange({ hasRevenue: !profile.hasRevenue })}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                profile.hasRevenue
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-gray-300"
              }`}
            >
              {profile.hasRevenue && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </button>
            <span className="text-sm text-gray-700">We have revenue</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => onChange({ raisingFunding: !profile.raisingFunding })}
              className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                profile.raisingFunding
                  ? "bg-indigo-600 border-indigo-600"
                  : "border-gray-300"
              }`}
            >
              {profile.raisingFunding && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
            </button>
            <span className="text-sm text-gray-700">We are currently raising / planning to raise funding</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function DocumentStep({
  profile,
  documentsHeld,
  onToggle,
}: {
  profile: ProfileData;
  documentsHeld: Set<string>;
  onToggle: (docId: string) => void;
}) {
  const relevantDocs = useMemo(() => getRelevantDocuments(profile), [profile]);

  // Group by domain
  const grouped = useMemo(() => {
    const map: Record<string, typeof relevantDocs> = {};
    for (const doc of relevantDocs) {
      const domain = doc.domain.replace("_", " ");
      if (!map[domain]) map[domain] = [];
      map[domain].push(doc);
    }
    return Object.entries(map);
  }, [relevantDocs]);

  return (
    <div className="space-y-6">
      <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg">
        <p className="text-sm text-indigo-700">
          <span className="font-medium">Tick the documents you already have.</span> Don&apos;t worry if you&apos;re missing some — that&apos;s what we&apos;re here to find out.
        </p>
      </div>

      {grouped.map(([domain, docs]) => (
        <div key={domain}>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
            {domain}
          </p>
          <div className="space-y-2">
            {docs.map((doc) => {
              const held = documentsHeld.has(doc.id);
              return (
                <button
                  key={doc.id}
                  onClick={() => onToggle(doc.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                    held
                      ? "border-emerald-300 bg-emerald-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all ${
                      held ? "bg-emerald-600 border-emerald-600" : "border-gray-300"
                    }`}
                  >
                    {held && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{doc.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HealthCheckFlow() {
  const router = useRouter();
  const [step, setStep] = useState<"profile" | "documents" | "analysing">("profile");
  const [profile, setProfile] = useState<Partial<ProfileData>>({
    hasRevenue: false,
    raisingFunding: false,
  });
  const [documentsHeld, setDocumentsHeld] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const profileComplete =
    profile.stage &&
    profile.jurisdiction &&
    profile.cofounders &&
    profile.employees &&
    profile.industry;

  const handleProfileChange = (updates: Partial<ProfileData>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
  };

  const handleDocToggle = (docId: string) => {
    setDocumentsHeld((prev) => {
      const next = new Set(prev);
      if (next.has(docId)) next.delete(docId);
      else next.add(docId);
      return next;
    });
  };

  const handleSubmit = async () => {
    setStep("analysing");
    setError("");

    try {
      const res = await fetch("/api/health-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profile: profile as ProfileData,
          documentsHeld: Array.from(documentsHeld),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Assessment failed");
      }

      const result = await res.json();
      localStorage.setItem("orion_health_check", JSON.stringify(result));
      router.push("/health-check/results");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("documents");
    }
  };

  const currentStep = step === "profile" ? 1 : 2;
  const progressPercent = step === "analysing" ? 100 : (currentStep / 2) * 100;

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
              <span className="text-sm font-semibold text-gray-900">Legal Health Check</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={step === "profile" ? "info" : "outline"}>
                {step === "profile" ? "1. Profile" : step === "documents" ? "2. Documents" : "Analysing"}
              </Badge>
            </div>
          </div>
          <Progress value={progressPercent} />
        </div>
      </div>

      {/* Analysing state */}
      {step === "analysing" && (
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-50 mb-6">
            <Sparkles className="w-8 h-8 text-indigo-600 animate-pulse" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Our legal team is reviewing your setup...
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Our AI — backed by 50 years of combined legal expertise — is analysing your profile and document gaps across 10 legal domains.
          </p>
          <div className="flex items-center justify-center gap-2 text-xs text-gray-400">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            This usually takes 15-30 seconds
          </div>
        </div>
      )}

      {/* Profile step */}
      {step === "profile" && (
        <div className="max-w-2xl mx-auto px-6 pb-32">
          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Tell us about your startup</h2>
                  <p className="text-sm text-gray-500">This helps us tailor the assessment to your situation</p>
                </div>
              </div>
              <ProfileStep profile={profile} onChange={handleProfileChange} />
            </div>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100">
            <div className="max-w-2xl mx-auto px-6 py-4 flex justify-end">
              <Button onClick={() => setStep("documents")} disabled={!profileComplete}>
                Next: Select your documents
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Documents step */}
      {step === "documents" && (
        <div className="max-w-2xl mx-auto px-6 pb-32">
          <Card className="mt-6">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Which documents do you have?</h2>
                  <p className="text-sm text-gray-500">
                    Based on your profile, these are the documents relevant to your startup.
                    Showing {getRelevantDocuments(profile as ProfileData).length} documents.
                  </p>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}

              <DocumentStep
                profile={profile as ProfileData}
                documentsHeld={documentsHeld}
                onToggle={handleDocToggle}
              />
            </div>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100">
            <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
              <Button variant="ghost" onClick={() => setStep("profile")}>
                <ChevronLeft className="w-4 h-4" />
                Back
              </Button>
              <Button onClick={handleSubmit}>
                <Sparkles className="w-4 h-4" />
                Get AI Assessment
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
