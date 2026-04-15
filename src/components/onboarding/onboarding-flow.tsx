"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  stageOptions,
  jurisdictionOptions,
  cofounderOptions,
  employeeOptions,
  industryOptions,
  getRelevantDocuments,
} from "@/lib/health-check/questions";
import type { ProfileData } from "@/lib/health-check/types";
import { persistHealthCheck } from "@/app/actions/health-check";
import {
  Building2,
  FileText,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

export default function OnboardingFlow() {
  const router = useRouter();
  const [step, setStep] = useState<"profile" | "documents" | "analysing">(
    "profile"
  );
  const [companyName, setCompanyName] = useState("");
  const [profile, setProfile] = useState<Partial<ProfileData>>({
    hasRevenue: false,
    raisingFunding: false,
  });
  const [documentsHeld, setDocumentsHeld] = useState<Set<string>>(new Set());
  const [error, setError] = useState("");

  const profileComplete =
    companyName.trim() &&
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
      // 1. Run AI health check assessment
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

      // 2. Persist to database (user is already authenticated at this point)
      const persistResult = await persistHealthCheck(JSON.stringify(result));

      if (persistResult.error) {
        throw new Error(persistResult.error);
      }

      // 3. Also save the company name to the startup
      await fetch("/api/onboarding/complete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName: companyName.trim(),
          startupId: persistResult.startupId,
        }),
      });

      router.push("/dashboard");
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
              <span className="text-sm font-semibold text-gray-900">
                Set up your account
              </span>
            </div>
            <Badge
              variant={step === "profile" ? "info" : "outline"}
            >
              {step === "profile"
                ? "1. Your startup"
                : step === "documents"
                  ? "2. Your documents"
                  : "Analysing"}
            </Badge>
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
            Preparing your legal health report...
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Our AI legal team is analysing your profile and documents across 10
            legal domains to generate your personalised dashboard.
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
                  <h2 className="text-lg font-semibold text-gray-900">
                    Tell us about your startup
                  </h2>
                  <p className="text-sm text-gray-500">
                    This helps us tailor your legal health assessment
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Company name */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Company name
                  </p>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Inc"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50"
                  />
                </div>

                {/* Stage */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    What stage is your startup?
                  </p>
                  <div className="space-y-2">
                    {stageOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        selected={profile.stage === opt.value}
                        label={opt.label}
                        onClick={() => handleProfileChange({ stage: opt.value })}
                      />
                    ))}
                  </div>
                </div>

                {/* Jurisdiction */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Where is your company based?
                  </p>
                  <div className="space-y-2">
                    {jurisdictionOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        selected={profile.jurisdiction === opt.value}
                        label={opt.label}
                        onClick={() =>
                          handleProfileChange({ jurisdiction: opt.value })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Cofounders */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    How many co-founders?
                  </p>
                  <div className="space-y-2">
                    {cofounderOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        selected={profile.cofounders === opt.value}
                        label={opt.label}
                        onClick={() =>
                          handleProfileChange({ cofounders: opt.value })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Employees */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Do you have employees or contractors?
                  </p>
                  <div className="space-y-2">
                    {employeeOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        selected={profile.employees === opt.value}
                        label={opt.label}
                        onClick={() =>
                          handleProfileChange({ employees: opt.value })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Industry */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    What industry?
                  </p>
                  <div className="space-y-2">
                    {industryOptions.map((opt) => (
                      <OptionButton
                        key={opt.value}
                        selected={profile.industry === opt.value}
                        label={opt.label}
                        onClick={() =>
                          handleProfileChange({ industry: opt.value })
                        }
                      />
                    ))}
                  </div>
                </div>

                {/* Quick questions */}
                <div>
                  <p className="text-sm font-medium text-gray-900 mb-2">
                    Quick questions
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleProfileChange({ hasRevenue: !profile.hasRevenue })
                        }
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          profile.hasRevenue
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-gray-300"
                        )}
                      >
                        {profile.hasRevenue && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                      <span className="text-sm text-gray-700">
                        We have revenue
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          handleProfileChange({
                            raisingFunding: !profile.raisingFunding,
                          })
                        }
                        className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                          profile.raisingFunding
                            ? "bg-indigo-600 border-indigo-600"
                            : "border-gray-300"
                        )}
                      >
                        {profile.raisingFunding && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                        )}
                      </button>
                      <span className="text-sm text-gray-700">
                        We are currently raising / planning to raise funding
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100">
            <div className="max-w-2xl mx-auto px-6 py-4 flex justify-end">
              <Button
                onClick={() => setStep("documents")}
                disabled={!profileComplete}
              >
                Next: Select your documents
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Documents step */}
      {step === "documents" && (
        <DocumentsStep
          profile={profile as ProfileData}
          documentsHeld={documentsHeld}
          onToggle={handleDocToggle}
          onBack={() => setStep("profile")}
          onSubmit={handleSubmit}
          error={error}
        />
      )}
    </div>
  );
}

function DocumentsStep({
  profile,
  documentsHeld,
  onToggle,
  onBack,
  onSubmit,
  error,
}: {
  profile: ProfileData;
  documentsHeld: Set<string>;
  onToggle: (docId: string) => void;
  onBack: () => void;
  onSubmit: () => void;
  error: string;
}) {
  const relevantDocs = useMemo(() => getRelevantDocuments(profile), [profile]);

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
    <div className="max-w-2xl mx-auto px-6 pb-32">
      <Card className="mt-6">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">
                Which documents do you have?
              </h2>
              <p className="text-sm text-gray-500">
                Based on your profile, these are relevant to your startup.
                Showing {relevantDocs.length} documents.
              </p>
            </div>
          </div>

          <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg mb-6">
            <p className="text-sm text-indigo-700">
              <span className="font-medium">
                Tick the documents you already have.
              </span>{" "}
              Don&apos;t worry if you&apos;re missing some — our AI will
              identify the gaps and prioritise what matters.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div className="space-y-6">
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
                          className={cn(
                            "w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 shrink-0 transition-all",
                            held
                              ? "bg-emerald-600 border-emerald-600"
                              : "border-gray-300"
                          )}
                        >
                          {held && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            {doc.description}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100">
        <div className="max-w-2xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
            Back
          </Button>
          <Button onClick={onSubmit}>
            <Sparkles className="w-4 h-4" />
            Get my legal health score
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
