/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { HealthCheckResult, IssueFinding } from "@/lib/health-check/types";
import {
  Shield,
  AlertTriangle,
  CheckCircle2,
  FileText,
  Users,
  Lock,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ListOrdered,
} from "lucide-react";

const severityConfig = {
  critical: {
    label: "Critical",
    variant: "danger" as const,
    color: "text-red-600",
  },
  high: { label: "High", variant: "warning" as const, color: "text-amber-600" },
  medium: { label: "Medium", variant: "info" as const, color: "text-blue-600" },
  low: { label: "Low", variant: "default" as const, color: "text-gray-600" },
  info: { label: "Info", variant: "outline" as const, color: "text-gray-500" },
};

const resolutionLabels = {
  self_serve: {
    label: "Self-serve",
    icon: <CheckCircle2 className="w-3.5 h-3.5" />,
  },
  document_generation: {
    label: "Generate document",
    icon: <FileText className="w-3.5 h-3.5" />,
  },
  expert_referral: {
    label: "Expert help needed",
    icon: <Users className="w-3.5 h-3.5" />,
  },
};

const domainLabels: Record<string, string> = {
  incorporation: "Incorporation & Structure",
  equity: "Equity & Founders",
  governance: "Governance",
  employment: "Employment & Contractors",
  ip: "Intellectual Property",
  contracts: "Contracts & Agreements",
  data_privacy: "Data & Privacy",
  regulation: "Regulation",
  tax: "Tax",
  investment_readiness: "Investment Readiness",
};

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color =
    score >= 80
      ? "stroke-emerald-500"
      : score >= 60
        ? "stroke-amber-500"
        : score >= 40
          ? "stroke-orange-500"
          : "stroke-red-500";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth="10"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          className={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-bold text-gray-900">{score}</span>
        <span className="text-xs text-gray-500">/ 100</span>
      </div>
    </div>
  );
}

function AuthGateModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="max-w-sm mx-4 shadow-xl">
        <div className="p-6 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Sign up to take action
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Create a free account to generate documents, get AI guidance,
            request expert help, and save your assessment.
          </p>
          <div className="space-y-3">
            <Link href="/signup" className="block">
              <Button className="w-full">
                Create free account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/login" className="block">
              <Button variant="outline" className="w-full">
                Already have an account? Sign in
              </Button>
            </Link>
          </div>
          <button
            onClick={onClose}
            className="mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Continue browsing results
          </button>
        </div>
      </Card>
    </div>
  );
}

function IssueCard({
  issue,
  onAction,
}: {
  issue: IssueFinding;
  onAction: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const severity = severityConfig[issue.severity];
  const resolution = resolutionLabels[issue.resolutionPath];

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-4 flex items-start gap-3"
      >
        <div className="mt-0.5">
          {issue.severity === "critical" || issue.severity === "high" ? (
            <AlertTriangle className={`w-4 h-4 ${severity.color}`} />
          ) : (
            <Shield className={`w-4 h-4 ${severity.color}`} />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant={severity.variant}>{severity.label}</Badge>
            <span className="text-xs text-gray-400">
              {domainLabels[issue.domain] || issue.domain}
            </span>
          </div>
          <p className="text-sm font-medium text-gray-900">{issue.title}</p>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-400 mt-1 shrink-0" />
        )}
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-gray-50">
          <p className="text-sm text-gray-600 mt-3 mb-4">{issue.description}</p>
          <div className="bg-gray-50 rounded-lg p-3">
            <div className="flex items-center gap-1.5 text-xs font-medium text-gray-700 mb-1">
              {resolution.icon} {resolution.label}
            </div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {issue.recommendation.title}
            </p>
            <p className="text-xs text-gray-500 mb-3">
              {issue.recommendation.description}
            </p>
            <Button size="sm" onClick={onAction}>
              Take action <ArrowRight className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

export default function ResultsView() {
  const router = useRouter();
  const [result, setResult] = useState<HealthCheckResult | null>(null);
  const [showAuthGate, setShowAuthGate] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("orion_health_check");
    if (!stored) {
      router.push("/health-check");
      return;
    }
    setResult(JSON.parse(stored));
  }, [router]);

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-sm text-gray-400">
          Loading results...
        </div>
      </div>
    );
  }

  const {
    overallScore,
    riskLevel,
    domainScores,
    issues,
    summary,
    priorityActions,
  } = result;
  const criticalCount = issues.filter((i) => i.severity === "critical").length;
  const highCount = issues.filter((i) => i.severity === "high").length;
  const riskConfig = severityConfig[riskLevel];

  const activeDomains = Object.entries(domainScores)
    .filter(([, v]) => v !== undefined)
    .sort((a, b) => (a[1].score ?? 100) - (b[1].score ?? 100));

  return (
    <div className="min-h-screen bg-[#fafafa]">
      {showAuthGate && <AuthGateModal onClose={() => setShowAuthGate(false)} />}

      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xs">O</span>
            </div>
            <span className="text-sm font-semibold text-gray-900">
              Your Legal Health Report
            </span>
            <Badge variant="info" className="ml-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI-Powered
            </Badge>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/health-check")}
            >
              <RotateCcw className="w-3.5 h-3.5" /> Retake
            </Button>
            <Link href="/signup">
              <Button size="sm">
                Sign up to save <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
        {/* Score overview */}
        <Card>
          <div className="p-6">
            <div className="flex items-center gap-8">
              <ScoreRing score={overallScore} />
              <div className="flex-1">
                <h1 className="text-xl font-semibold text-gray-900 mb-1">
                  Legal Health Score
                </h1>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant={riskConfig.variant}>
                    {riskConfig.label} Risk
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {issues.length} issue{issues.length !== 1 ? "s" : ""} found
                  </span>
                </div>
                <p className="text-sm text-gray-600">{summary}</p>
                {(criticalCount > 0 || highCount > 0) && (
                  <div className="flex items-center gap-3 mt-3">
                    {criticalCount > 0 && (
                      <span className="text-xs font-medium text-red-600">
                        {criticalCount} critical
                      </span>
                    )}
                    {highCount > 0 && (
                      <span className="text-xs font-medium text-amber-600">
                        {highCount} high priority
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Priority Actions */}
        {priorityActions && priorityActions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ListOrdered className="w-4 h-4 text-indigo-600" />
                <CardTitle>Priority Actions</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <ol className="space-y-3">
                {priorityActions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-xs font-bold shrink-0">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-700 pt-0.5">{action}</p>
                  </li>
                ))}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Domain breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Score by Area</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {activeDomains.map(([domain, data]) => (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-700">
                      {domainLabels[domain] || domain}
                    </span>
                    <div className="flex items-center gap-2">
                      {data.issues > 0 && (
                        <span className="text-xs text-gray-400">
                          {data.issues} issue{data.issues !== 1 ? "s" : ""}
                        </span>
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        {data.score}%
                      </span>
                    </div>
                  </div>
                  <Progress
                    value={data.score}
                    indicatorClassName={
                      data.score >= 80
                        ? "bg-emerald-500"
                        : data.score >= 60
                          ? "bg-amber-500"
                          : data.score >= 40
                            ? "bg-orange-500"
                            : "bg-red-500"
                    }
                  />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Issues */}
        {issues.length > 0 && (
          <div>
            <h2 className="text-base font-semibold text-gray-900 mb-3">
              Issues & Recommendations
            </h2>
            <div className="space-y-3">
              {issues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onAction={() => setShowAuthGate(true)}
                />
              ))}
            </div>
          </div>
        )}

        {/* CTA */}
        <Card className="bg-indigo-600 border-indigo-600">
          <div className="p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              Ready to fix these issues?
            </h3>
            <p className="text-sm text-indigo-100 mb-4">
              Sign up for free to generate documents, get AI-powered guidance,
              and connect with legal experts.
            </p>
            <Link href="/signup">
              <Button
                variant="secondary"
                size="lg"
                className="bg-white text-indigo-600 hover:bg-indigo-50"
              >
                Create free account <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
