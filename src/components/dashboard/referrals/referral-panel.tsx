"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createReferral, getUserReferrals, getUserIssues } from "@/app/actions/referrals";
import {
  Users,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  MessageSquare,
} from "lucide-react";

interface Issue {
  id: string;
  title: string;
  description: string;
  domain: string;
  severity: string;
  resolutionPath: string;
  isResolved: boolean;
}

interface Referral {
  id: string;
  status: string;
  issueSummary: string;
  providerNotes: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
  issueTitle: string;
  issueSeverity: string;
  issueDomain: string;
}

const severityConfig: Record<string, { label: string; variant: "danger" | "warning" | "info" | "default" }> = {
  critical: { label: "Critical", variant: "danger" },
  high: { label: "High", variant: "warning" },
  medium: { label: "Medium", variant: "info" },
  low: { label: "Low", variant: "default" },
};

const statusConfig: Record<string, { label: string; variant: "warning" | "info" | "success" | "default"; icon: React.ReactNode }> = {
  requested: { label: "Requested", variant: "warning", icon: <Clock className="w-3 h-3" /> },
  matched: { label: "Matched", variant: "info", icon: <Users className="w-3 h-3" /> },
  in_progress: { label: "In Progress", variant: "info", icon: <MessageSquare className="w-3 h-3" /> },
  resolved: { label: "Resolved", variant: "success", icon: <CheckCircle2 className="w-3 h-3" /> },
  cancelled: { label: "Cancelled", variant: "default", icon: <Clock className="w-3 h-3" /> },
};

function RequestForm({
  issues,
  onSubmit,
  submitting,
}: {
  issues: Issue[];
  onSubmit: (issueId: string, summary: string) => void;
  submitting: boolean;
}) {
  const [selectedIssue, setSelectedIssue] = useState("");
  const [additionalContext, setAdditionalContext] = useState("");

  const expertIssues = issues.filter(
    (i) => !i.isResolved && (i.resolutionPath === "expert_referral" || i.severity === "critical" || i.severity === "high")
  );

  const selected = expertIssues.find((i) => i.id === selectedIssue);

  const handleSubmit = () => {
    if (!selectedIssue || !selected) return;
    const summary = `Issue: ${selected.title}\nDomain: ${selected.domain}\nSeverity: ${selected.severity}\nDescription: ${selected.description}${additionalContext ? `\n\nAdditional context: ${additionalContext}` : ""}`;
    onSubmit(selectedIssue, summary);
  };

  if (expertIssues.length === 0) {
    return (
      <Card>
        <div className="p-8 text-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-gray-900 mb-1">No issues requiring expert help</h3>
          <p className="text-xs text-gray-500">
            Complete a legal health check to identify issues, or all your critical issues have been resolved.
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Expert Help</CardTitle>
        <CardDescription>
          Select an issue and we&apos;ll connect you with a qualified legal professional
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Select an issue
            </label>
            <div className="space-y-2">
              {expertIssues.map((issue) => {
                const sev = severityConfig[issue.severity] || severityConfig.low;
                return (
                  <button
                    key={issue.id}
                    onClick={() => setSelectedIssue(issue.id)}
                    className={`w-full text-left p-3 rounded-lg border transition-all ${
                      selectedIssue === issue.id
                        ? "border-indigo-500 bg-indigo-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={sev.variant}>{sev.label}</Badge>
                      <span className="text-xs text-gray-400 capitalize">{issue.domain.replace("_", " ")}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-900">{issue.title}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedIssue && (
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1.5">
                Additional context (optional)
              </label>
              <textarea
                value={additionalContext}
                onChange={(e) => setAdditionalContext(e.target.value)}
                placeholder="Any additional details that would help the expert..."
                rows={3}
                className="w-full px-3 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-900 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none"
              />
            </div>
          )}

          <Button
            onClick={handleSubmit}
            disabled={!selectedIssue || submitting}
            className="w-full"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
            {submitting ? "Submitting..." : "Request Expert Help"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReferralPanel() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [referralsList, setReferralsList] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");

  const loadData = useCallback(async () => {
    const [issueData, referralData] = await Promise.all([
      getUserIssues(),
      getUserReferrals(),
    ]);
    setIssues(issueData as Issue[]);
    setReferralsList(referralData as Referral[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSubmit = async (issueId: string, summary: string) => {
    setSubmitting(true);
    setSuccess("");
    const result = await createReferral({ issueId, issueSummary: summary });
    setSubmitting(false);

    if (result.error) {
      alert(result.error);
      return;
    }

    setSuccess("Your referral request has been submitted. We'll match you with an expert shortly.");
    loadData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {success && (
        <div className="p-3 bg-emerald-50 border border-emerald-100 rounded-lg flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <p className="text-sm text-emerald-700">{success}</p>
        </div>
      )}

      <RequestForm issues={issues} onSubmit={handleSubmit} submitting={submitting} />

      {referralsList.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-3">Your Referral Requests</h2>
          <div className="space-y-3">
            {referralsList.map((ref) => {
              const status = statusConfig[ref.status] || statusConfig.requested;
              const sev = severityConfig[ref.issueSeverity] || severityConfig.low;
              return (
                <Card key={ref.id}>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant={sev.variant}>{sev.label}</Badge>
                        <span className="text-xs text-gray-400 capitalize">
                          {ref.issueDomain.replace("_", " ")}
                        </span>
                      </div>
                      <Badge variant={status.variant} className="flex items-center gap-1">
                        {status.icon}
                        {status.label}
                      </Badge>
                    </div>
                    <p className="text-sm font-medium text-gray-900 mb-1">{ref.issueTitle}</p>
                    <p className="text-xs text-gray-500">
                      Requested {new Date(ref.createdAt).toLocaleDateString()}
                    </p>
                    {ref.providerNotes && (
                      <div className="mt-3 p-2 bg-blue-50 border border-blue-100 rounded-lg">
                        <p className="text-xs text-blue-700">
                          <span className="font-medium">Expert note:</span> {ref.providerNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
