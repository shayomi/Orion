import {
  getAssessmentTemplateDetail,
  getSubmissionCountByTemplate,
} from "@/app/actions/admin";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { requireActiveAdmin } from "@/lib/admin";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TemplateSettingsForm } from "@/components/admin/template-settings-form";
import { TemplateSectionsEditor } from "@/components/admin/template-sections-editor";
import { TemplateRulesEditor } from "@/components/admin/template-rules-editor";

type TemplateDetailPageProps = {
  params: Promise<{ templateId: string }>;
};

function statusVariant(status: string) {
  if (status === "published") return "success" as const;
  if (status === "archived") return "warning" as const;
  return "info" as const;
}

function formatDate(value: Date | string | null) {
  if (!value) return "-";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString();
}

export default async function AssessmentTemplateDetailPage({
  params,
}: TemplateDetailPageProps) {
  await requireActiveAdmin();

  const { templateId } = await params;
  const [detail, submissionCount] = await Promise.all([
    getAssessmentTemplateDetail(templateId),
    getSubmissionCountByTemplate(templateId),
  ]);

  if (!detail) {
    notFound();
  }

  const { template, sections, questions, rules } = detail;

  const serializedTemplate = {
    ...template,
    publishedAt: template.publishedAt?.toISOString() ?? null,
    createdAt: template.createdAt.toISOString(),
    updatedAt: template.updatedAt.toISOString(),
  };

  const serializedSections = sections.map((s) => ({
    ...s,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
  }));

  const serializedQuestions = questions.map((q) => ({
    ...q,
    createdAt: q.createdAt.toISOString(),
    updatedAt: q.updatedAt.toISOString(),
  }));

  const serializedRules = rules.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
    updatedAt: r.updatedAt.toISOString(),
  }));

  return (
    <div>
      <Topbar title={template.name} subtitle="Assessment template editor" />
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <Link
            href="/admin/assessments"
            className="text-sm text-indigo-600 hover:text-indigo-700"
          >
            &larr; Back to templates
          </Link>
          <div className="flex items-center gap-4">
            <Link
              href={`/admin/assessments/submissions?templateId=${template.id}`}
              className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
            >
              View Submissions ({submissionCount})
            </Link>
            <span className="text-xs text-gray-400">
              Created {formatDate(template.createdAt)}
            </span>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Status</p>
            <div className="mt-1">
              <Badge variant={statusVariant(template.status)}>
                {template.status}
              </Badge>
            </div>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Version</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">v{template.version}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Sections</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{sections.length}</p>
          </div>
          <div className="bg-white rounded-xl p-5">
            <p className="text-sm text-gray-400">Questions / Rules</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {questions.length} / {rules.length}
            </p>
          </div>
        </div>

        <TemplateSettingsForm template={serializedTemplate} />

        <TemplateSectionsEditor
          templateId={template.id}
          sections={serializedSections}
          questions={serializedQuestions}
        />

        <TemplateRulesEditor
          templateId={template.id}
          rules={serializedRules}
        />
      </div>
    </div>
  );
}
