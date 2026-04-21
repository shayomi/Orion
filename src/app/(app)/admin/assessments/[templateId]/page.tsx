import { getAssessmentTemplateDetail } from "@/app/actions/admin";
import { Topbar } from "@/components/layout/topbar";
import { Badge } from "@/components/ui/badge";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
  const detail = await getAssessmentTemplateDetail(templateId);

  if (!detail) {
    notFound();
  }

  const { template, sections, questions, rules } = detail;

  // Serialize dates for client components
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
          <div className="text-xs text-gray-500">
            Created {formatDate(template.createdAt)}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader>
              <CardDescription>Status</CardDescription>
              <CardTitle>
                <Badge variant={statusVariant(template.status)}>
                  {template.status}
                </Badge>
              </CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Version</CardDescription>
              <CardTitle>v{template.version}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Sections</CardDescription>
              <CardTitle>{sections.length}</CardTitle>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardDescription>Questions / Rules</CardDescription>
              <CardTitle>
                {questions.length} / {rules.length}
              </CardTitle>
            </CardHeader>
          </Card>
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
