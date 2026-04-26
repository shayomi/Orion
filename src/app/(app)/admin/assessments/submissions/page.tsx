import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  listAssessmentSubmissions,
  listPublishedTemplatesForFilter,
} from "@/app/actions/admin";
import { ArrowLeft, Eye, FileText } from "lucide-react";
import { Pagination } from "@/components/admin/pagination";

interface Props {
  searchParams: Promise<{ templateId?: string; page?: string }>;
}

const riskColors: Record<string, string> = {
  critical: "bg-red-50 text-red-700 border-red-200",
  high: "bg-orange-50 text-orange-700 border-orange-200",
  medium: "bg-amber-50 text-amber-700 border-amber-200",
  low: "bg-emerald-50 text-emerald-700 border-emerald-200",
  info: "bg-blue-50 text-blue-700 border-blue-200",
};

const statusColors: Record<string, string> = {
  in_progress: "bg-indigo-50 text-indigo-700 border-indigo-200",
  completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expired: "bg-gray-50 text-gray-700 border-gray-200",
};

export default async function SubmissionsPage({ searchParams }: Props) {
  const params = await searchParams;
  const templateId = params.templateId || undefined;
  const page = parseInt(params.page || "1", 10);

  const [data, templates] = await Promise.all([
    listAssessmentSubmissions(templateId, page),
    listPublishedTemplatesForFilter(),
  ]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/admin/assessments">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4" />
              Templates
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">
              Assessment Submissions
            </h1>
            <p className="text-sm text-gray-400">
              {data.total} submission{data.total !== 1 ? "s" : ""} total
            </p>
          </div>
        </div>
      </div>

      {/* Filter */}
      {templates.length > 0 && (
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">Filter by template:</span>
          <div className="flex gap-2 flex-wrap">
            <Link href="/admin/assessments/submissions">
              <Badge
                variant={!templateId ? "info" : "outline"}
                className="cursor-pointer"
              >
                All
              </Badge>
            </Link>
            {templates.map((t) => (
              <Link
                key={t.id}
                href={`/admin/assessments/submissions?templateId=${t.id}`}
              >
                <Badge
                  variant={templateId === t.id ? "info" : "outline"}
                  className="cursor-pointer"
                >
                  {t.name}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100/60 bg-gray-50/30">
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                User
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Startup
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Template
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Score
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Risk
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Status
              </th>
              <th className="text-left px-4 py-3 font-medium text-gray-500">
                Date
              </th>
              <th className="text-right px-4 py-3 font-medium text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50/60">
            {data.items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div>
                    <p className="font-medium text-gray-900">
                      {item.userName || "Unknown"}
                    </p>
                    <p className="text-xs text-gray-400">{item.userEmail}</p>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {item.startupName || "—"}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {item.templateName || "—"}
                </td>
                <td className="px-4 py-3">
                  {item.overallScore !== null ? (
                    <span className="font-semibold text-gray-900">
                      {item.overallScore}/100
                    </span>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  {item.riskLevel ? (
                    <Badge
                      variant="outline"
                      className={riskColors[item.riskLevel] || ""}
                    >
                      {item.riskLevel}
                    </Badge>
                  ) : (
                    <span className="text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Badge
                    variant="outline"
                    className={statusColors[item.status] || ""}
                  >
                    {item.status.replace("_", " ")}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {item.createdAt
                    ? new Date(item.createdAt).toLocaleDateString()
                    : "—"}
                </td>
                <td className="px-4 py-3 text-right">
                  <Link
                    href={`/admin/assessments/submissions/${item.id}`}
                  >
                    <Button variant="ghost" size="sm">
                      <Eye className="w-4 h-4" />
                      View
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
            {data.items.length === 0 && (
              <tr>
                <td
                  colSpan={8}
                  className="px-4 py-12 text-center text-gray-400"
                >
                  <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  No submissions yet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data.totalPages > 1 && (
        <Pagination
          page={data.page}
          totalPages={data.totalPages}
          total={data.total}
          basePath="/admin/assessments/submissions"
          searchParams={{ templateId }}
        />
      )}
    </div>
  );
}
