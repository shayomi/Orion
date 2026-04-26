import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getAssessmentSubmissionDetail } from "@/app/actions/admin";
import {
  ArrowLeft,
  User,
  Building2,
  FileText,
  Download,
  Calendar,
  Shield,
  BarChart3,
} from "lucide-react";

interface Props {
  params: Promise<{ assessmentId: string }>;
}

const riskColors: Record<string, string> = {
  critical: "bg-red-50 text-red-700",
  high: "bg-orange-50 text-orange-700",
  medium: "bg-amber-50 text-amber-700",
  low: "bg-emerald-50 text-emerald-700",
  info: "bg-blue-50 text-blue-700",
};

const statusColors: Record<string, string> = {
  in_progress: "bg-indigo-50 text-indigo-700",
  completed: "bg-emerald-50 text-emerald-700",
  expired: "bg-gray-50 text-gray-700",
};

export default async function SubmissionDetailPage({ params }: Props) {
  const { assessmentId } = await params;
  const data = await getAssessmentSubmissionDetail(assessmentId);

  if (!data) notFound();

  const { assessment, responses, uploads } = data;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <Link href="/admin/assessments/submissions">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">
            Submission Detail
          </h1>
          <p className="text-sm text-gray-400">
            Assessment {assessmentId.slice(0, 8)}...
          </p>
        </div>
      </div>

      {/* Metadata cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50/80 flex items-center justify-center">
              <User className="w-4.5 h-4.5 text-indigo-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">User</p>
              <p className="text-sm font-medium text-gray-900">
                {assessment.userName || "Unknown"}
              </p>
              <p className="text-xs text-gray-400">{assessment.userEmail}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-purple-50/80 flex items-center justify-center">
              <Building2 className="w-4.5 h-4.5 text-purple-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Startup</p>
              <p className="text-sm font-medium text-gray-900">
                {assessment.startupName || "\u2014"}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-50/80 flex items-center justify-center">
              <BarChart3 className="w-4.5 h-4.5 text-emerald-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {assessment.overallScore ?? "\u2014"}
                {assessment.overallScore !== null && (
                  <span className="text-sm font-normal text-gray-400">
                    /100
                  </span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50/80 flex items-center justify-center">
              <Shield className="w-4.5 h-4.5 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-gray-400">Risk / Status</p>
              <div className="flex items-center gap-2 mt-1">
                {assessment.riskLevel && (
                  <Badge
                    variant="outline"
                    className={riskColors[assessment.riskLevel] || ""}
                  >
                    {assessment.riskLevel}
                  </Badge>
                )}
                <Badge
                  variant="outline"
                  className={statusColors[assessment.status] || ""}
                >
                  {assessment.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Extra info row */}
      <div className="flex flex-wrap items-center gap-4 md:gap-6 text-sm text-gray-400">
        <span className="flex items-center gap-1.5">
          <FileText className="w-4 h-4" />
          Template: {assessment.templateName || "\u2014"}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          Submitted:{" "}
          {assessment.completedAt
            ? new Date(assessment.completedAt).toLocaleString()
            : assessment.createdAt
            ? new Date(assessment.createdAt).toLocaleString()
            : "\u2014"}
        </span>
        <span>{responses.length} responses</span>
        <span>{uploads.length} file{uploads.length !== 1 ? "s" : ""}</span>
      </div>

      {/* Responses */}
      <div className="bg-white rounded-xl">
        <div className="px-6 pt-6 pb-2">
          <h2 className="text-base font-semibold text-gray-900">Responses</h2>
        </div>
        <div className="px-6 pb-6">
          {responses.length === 0 ? (
            <p className="text-sm text-gray-400">No responses recorded.</p>
          ) : (
            <div className="divide-y divide-gray-100/60">
              {responses.map((r, i) => {
                const answerStr =
                  typeof r.answer === "string"
                    ? r.answer
                    : JSON.stringify(r.answer);
                let fileRef: {
                  uploadId: string;
                  fileName: string;
                } | null = null;
                try {
                  const parsed =
                    typeof r.answer === "string"
                      ? JSON.parse(r.answer)
                      : r.answer;
                  if (parsed && parsed.uploadId && parsed.fileName) {
                    fileRef = parsed;
                  }
                } catch {
                  // not JSON
                }

                return (
                  <div key={r.id} className="py-4 first:pt-0 last:pb-0">
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-indigo-50/80 text-indigo-600 text-xs font-medium flex items-center justify-center shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900">
                          {r.questionText}
                        </p>
                        {r.domain && (
                          <span className="inline-block mt-1 text-xs text-gray-400">
                            {r.domain}
                          </span>
                        )}
                        <div className="mt-2">
                          {fileRef ? (
                            <Link
                              href={`/api/admin/uploads/${fileRef.uploadId}/download`}
                              className="inline-flex items-center gap-2 px-3 py-2 bg-indigo-50/80 rounded-lg text-sm text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                              <Download className="w-4 h-4" />
                              {fileRef.fileName}
                            </Link>
                          ) : Array.isArray(r.answer) ? (
                            <div className="flex flex-wrap gap-1.5">
                              {(r.answer as string[]).map((a, j) => (
                                <Badge key={j} variant="outline">
                                  {String(a)}
                                </Badge>
                              ))}
                            </div>
                          ) : (
                            <p className="text-sm text-gray-600 bg-gray-50/60 rounded-lg px-3 py-2">
                              {answerStr}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Uploaded Documents */}
      {uploads.length > 0 && (
        <div className="bg-white rounded-xl">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-gray-900">
              Uploaded Documents ({uploads.length})
            </h2>
          </div>
          <div className="px-6 pb-6">
            <div className="space-y-3">
              {uploads.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center justify-between p-3 bg-gray-50/60 rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-5 h-5 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {u.name}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span>{u.mimeType}</span>
                        {u.fileSize && (
                          <span>
                            {(u.fileSize / 1024).toFixed(0)} KB
                          </span>
                        )}
                        {u.questionKey && (
                          <span>Q: {u.questionKey}</span>
                        )}
                        {u.domain && <span>{u.domain}</span>}
                      </div>
                    </div>
                  </div>
                  <Link
                    href={`/api/admin/uploads/${u.id}/download`}
                    className="shrink-0"
                  >
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
