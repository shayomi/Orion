"use server";

import { db } from "@/lib/db";
import {
  assessmentTemplates,
  assessmentTemplateSections,
  assessmentTemplateQuestions,
} from "@/lib/db/schema";
import { asc, eq, inArray } from "drizzle-orm";

/**
 * Fetches the published Legal Health Check template with all sections and questions.
 * Returns null if no published template exists.
 */
export async function getPublishedAssessment() {
  const [template] = await db
    .select()
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.status, "published"))
    .orderBy(asc(assessmentTemplates.createdAt))
    .limit(1);

  if (!template) return null;

  const sections = await db
    .select()
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.templateId, template.id))
    .orderBy(
      asc(assessmentTemplateSections.orderIndex),
      asc(assessmentTemplateSections.createdAt)
    );

  const sectionIds = sections.map((s) => s.id);

  const questions = sectionIds.length
    ? await db
        .select()
        .from(assessmentTemplateQuestions)
        .where(inArray(assessmentTemplateQuestions.sectionId, sectionIds))
        .orderBy(
          asc(assessmentTemplateQuestions.orderIndex),
          asc(assessmentTemplateQuestions.createdAt)
        )
    : [];

  // Serialize dates for client
  return {
    template: {
      id: template.id,
      name: template.name,
      description: template.description,
    },
    sections: sections.map((s) => ({
      id: s.id,
      title: s.title,
      description: s.description,
      orderIndex: s.orderIndex,
    })),
    questions: questions.map((q) => ({
      id: q.id,
      sectionId: q.sectionId,
      questionKey: q.questionKey,
      prompt: q.prompt,
      description: q.description,
      inputType: q.inputType,
      options: q.options as Record<string, unknown> | null,
      domain: q.domain,
      required: q.required,
      weight: q.weight,
      orderIndex: q.orderIndex,
    })),
  };
}
