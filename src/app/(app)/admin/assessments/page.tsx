import Link from "next/link";
import {
  getTemplateStatusCounts,
  listAssessmentTemplates,
} from "@/app/actions/admin";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/admin/pagination";
import { TemplateListActions } from "@/components/admin/template-list-actions";
import { TemplateRowActions } from "@/components/admin/template-row-actions";
import { requireActiveAdmin } from "@/lib/admin";

type AssessmentsPageProps = {
  searchParams: Promise<{
    q?: string;
    page?: string;
  }>;
};

const inputClass =
  "w-full rounded-lg bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:ring-2 focus:ring-indigo-100 transition-colors";

function formatDate(value: Date | string | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

function statusVariant(status: string) {
  if (status === "published") return "success" as const;
  if (status === "archived") return "warning" as const;
  return "info" as const;
}

export default async function AdminAssessmentsPage({
  searchParams,
}: AssessmentsPageProps) {
  await requireActiveAdmin();

  const { q, page: pageStr } = await searchParams;
  const search = q?.trim() ?? "";
  const page = Math.max(1, Number(pageStr) || 1);

  const [{ items: templates, total, totalPages }, statusCounts] =
    await Promise.all([
      listAssessmentTemplates(search, page),
      getTemplateStatusCounts(),
    ]);

  return (
    <div>
      <Topbar
        title="Assessment Templates"
        subtitle="Manage reusable assessment templates and publication status"
      />
      <div className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Total templates</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{total}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Draft</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.draft}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Published</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.published}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Archived</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{statusCounts.archived}</p>
          </div>
        </div>

        <TemplateListActions />

        <div className="bg-white rounded-xl">
          <div className="px-6 pt-6 pb-2">
            <h2 className="text-base font-semibold text-gray-900">Templates</h2>
            <p className="text-sm text-gray-400 mt-0.5">Search and manage template lifecycle</p>
          </div>
          <div className="px-6 pb-6 space-y-4">
            <form method="get" className="flex flex-col gap-3 sm:flex-row">
              <input
                name="q"
                defaultValue={search}
                placeholder="Search templates"
                className={inputClass}
              />
              <Button type="submit" variant="outline">
                Search
              </Button>
            </form>

            <div className="overflow-x-auto rounded-xl">
              <table className="min-w-full divide-y divide-gray-100/60 text-sm">
                <thead className="bg-gray-50/30 text-left text-xs uppercase tracking-wide text-gray-400">
                  <tr>
                    <th className="px-4 py-3 font-medium">Template</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Version</th>
                    <th className="px-4 py-3 font-medium">Content</th>
                    <th className="px-4 py-3 font-medium">Updated</th>
                    <th className="px-4 py-3 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50/60">
                  {templates.map((t) => (
                    <tr key={t.id}>
                      <td className="px-4 py-3 align-top">
                        <p className="font-medium text-gray-900">{t.name}</p>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <Badge variant={statusVariant(t.status)}>
                          {t.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-500">
                        v{t.version}
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-gray-500">
                        <p>{t.sectionCount} sections</p>
                        <p>{t.questionCount} questions</p>
                        <p>{t.ruleCount} rules</p>
                      </td>
                      <td className="px-4 py-3 align-top text-gray-500">
                        {formatDate(t.updatedAt || t.createdAt)}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/admin/assessments/${t.id}`}>
                            <Button size="sm" variant="outline" type="button">
                              Open
                            </Button>
                          </Link>

                          <TemplateRowActions
                            templateId={t.id}
                            status={t.status}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              total={total}
              basePath="/admin/assessments"
              searchParams={{ q: search || undefined }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
