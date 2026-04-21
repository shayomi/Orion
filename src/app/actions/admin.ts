"use server";

import { db } from "@/lib/db";
import {
  assessmentTemplateQuestions,
  assessmentTemplateRules,
  assessmentTemplateSections,
  assessmentTemplates,
  auditLog,
  users,
} from "@/lib/db/schema";
import { requireActiveAdmin } from "@/lib/admin";
import {
  asc,
  desc,
  eq,
  ilike,
  inArray,
  or,
  sql,
} from "drizzle-orm";
import { revalidatePath } from "next/cache";

// ─── Types ──────────────────────────────────────────────

export type ActionState = { error: string | null };

type UserRole = "member" | "admin";
type UserStatus = "active" | "suspended";
type TemplateStatus = "draft" | "published" | "archived";

const ROLES: UserRole[] = ["member", "admin"];
const USER_STATUSES: UserStatus[] = ["active", "suspended"];
const PAGE_SIZE = 20;

// ─── Helpers ────────────────────────────────────────────

function getString(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function getNumber(formData: FormData, key: string, fallback = 0) {
  const raw = getString(formData, key);
  if (!raw) return fallback;
  const parsed = Number(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function getBoolean(formData: FormData, key: string, fallback = false) {
  const value = formData.get(key);
  if (value === null) return fallback;
  if (typeof value === "string") {
    return value === "true" || value === "on" || value === "1";
  }
  return true;
}

function parseJsonInput(raw: string) {
  if (!raw.trim()) return null;
  try {
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function ok(): ActionState {
  return { error: null };
}

function err(message: string): ActionState {
  return { error: message };
}

async function createAuditEntry(params: {
  adminUserId: string;
  action: string;
  entityType: string;
  entityId?: string | null;
  details?: unknown;
}) {
  await db.insert(auditLog).values({
    userId: params.adminUserId,
    action: params.action,
    entityType: params.entityType,
    entityId: params.entityId ?? null,
    details: params.details ?? null,
  });
}

function revalidateAssessments(templateId?: string) {
  revalidatePath("/admin/assessments");
  if (templateId) {
    revalidatePath(`/admin/assessments/${templateId}`);
  }
}

// ─── User list (paginated) ──────────────────────────────

export async function listAdminUsers(query?: string, page = 1) {
  await requireActiveAdmin();

  const search = query?.trim();
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE;

  const whereClause = search
    ? or(
        ilike(users.email, `%${search}%`),
        ilike(users.name, `%${search}%`),
        ilike(users.role, `%${search}%`),
        ilike(users.status, `%${search}%`)
      )
    : undefined;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(users)
    .where(whereClause);

  const items = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      status: users.status,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(whereClause)
    .orderBy(desc(users.createdAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  const total = countResult.count;

  return {
    items,
    total,
    page,
    perPage: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

// ─── User mutations ─────────────────────────────────────

export async function updateAdminUserRole(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const userId = getString(formData, "userId");
  const role = getString(formData, "role") as UserRole;

  if (!userId || !ROLES.includes(role)) {
    return err("Invalid role update input.");
  }

  const [targetUser] = await db
    .select({ id: users.id, role: users.role, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    return err("User not found.");
  }

  if (targetUser.role === role) {
    return ok();
  }

  await db
    .update(users)
    .set({ role, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_user_role_updated",
    entityType: "user",
    entityId: userId,
    details: { previousRole: targetUser.role, newRole: role },
  });

  revalidatePath("/admin/users");
  return ok();
}

export async function updateAdminUserStatus(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const userId = getString(formData, "userId");
  const status = getString(formData, "status") as UserStatus;

  if (!userId || !USER_STATUSES.includes(status)) {
    return err("Invalid status update input.");
  }

  if (userId === admin.id && status === "suspended") {
    return err("You cannot suspend your own admin account.");
  }

  const [targetUser] = await db
    .select({ id: users.id, role: users.role, status: users.status })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!targetUser) {
    return err("User not found.");
  }

  if (targetUser.status === status) {
    return ok();
  }

  await db
    .update(users)
    .set({ status, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_user_status_updated",
    entityType: "user",
    entityId: userId,
    details: { previousStatus: targetUser.status, newStatus: status },
  });

  revalidatePath("/admin/users");
  return ok();
}

// ─── Assessment template list (paginated) ───────────────

export async function listAssessmentTemplates(query?: string, page = 1) {
  await requireActiveAdmin();

  const search = query?.trim();
  const offset = (Math.max(1, page) - 1) * PAGE_SIZE;

  const whereClause = search
    ? or(
        ilike(assessmentTemplates.name, `%${search}%`),
        ilike(assessmentTemplates.description, `%${search}%`),
        ilike(assessmentTemplates.status, `%${search}%`)
      )
    : undefined;

  const [countResult] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(assessmentTemplates)
    .where(whereClause);

  const items = await db
    .select({
      id: assessmentTemplates.id,
      name: assessmentTemplates.name,
      description: assessmentTemplates.description,
      status: assessmentTemplates.status,
      version: assessmentTemplates.version,
      publishedAt: assessmentTemplates.publishedAt,
      createdAt: assessmentTemplates.createdAt,
      updatedAt: assessmentTemplates.updatedAt,
      createdByUserId: assessmentTemplates.createdByUserId,
      sectionCount: sql<number>`count(distinct ${assessmentTemplateSections.id})::int`,
      questionCount: sql<number>`count(distinct ${assessmentTemplateQuestions.id})::int`,
      ruleCount: sql<number>`count(distinct ${assessmentTemplateRules.id})::int`,
    })
    .from(assessmentTemplates)
    .leftJoin(
      assessmentTemplateSections,
      eq(assessmentTemplateSections.templateId, assessmentTemplates.id)
    )
    .leftJoin(
      assessmentTemplateQuestions,
      eq(assessmentTemplateQuestions.sectionId, assessmentTemplateSections.id)
    )
    .leftJoin(
      assessmentTemplateRules,
      eq(assessmentTemplateRules.templateId, assessmentTemplates.id)
    )
    .where(whereClause)
    .groupBy(assessmentTemplates.id)
    .orderBy(desc(assessmentTemplates.updatedAt))
    .limit(PAGE_SIZE)
    .offset(offset);

  const total = countResult.count;

  return {
    items,
    total,
    page,
    perPage: PAGE_SIZE,
    totalPages: Math.max(1, Math.ceil(total / PAGE_SIZE)),
  };
}

// ─── Assessment template detail ─────────────────────────

export async function getAssessmentTemplateDetail(templateId: string) {
  await requireActiveAdmin();

  const [template] = await db
    .select()
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.id, templateId))
    .limit(1);

  if (!template) {
    return null;
  }

  const sections = await db
    .select()
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.templateId, templateId))
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

  const rules = await db
    .select()
    .from(assessmentTemplateRules)
    .where(eq(assessmentTemplateRules.templateId, templateId))
    .orderBy(
      asc(assessmentTemplateRules.priority),
      asc(assessmentTemplateRules.createdAt)
    );

  return { template, sections, questions, rules };
}

// ─── Template mutations ─────────────────────────────────

export async function createAssessmentTemplate(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const name = getString(formData, "name");
  const description = getString(formData, "description");

  if (!name) {
    return err("Template name is required.");
  }

  const [template] = await db
    .insert(assessmentTemplates)
    .values({
      name,
      description: description || null,
      createdByUserId: admin.id,
    })
    .returning({ id: assessmentTemplates.id, name: assessmentTemplates.name });

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_template_created",
    entityType: "assessment_template",
    entityId: template.id,
    details: { name: template.name },
  });

  revalidateAssessments(template.id);
  return ok();
}

export async function updateAssessmentTemplate(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const templateId = getString(formData, "templateId");
  const name = getString(formData, "name");
  const description = getString(formData, "description");

  if (!templateId || !name) {
    return err("Template id and name are required.");
  }

  const [existing] = await db
    .select({
      id: assessmentTemplates.id,
      name: assessmentTemplates.name,
      description: assessmentTemplates.description,
    })
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.id, templateId))
    .limit(1);

  if (!existing) {
    return err("Template not found.");
  }

  await db
    .update(assessmentTemplates)
    .set({ name, description: description || null, updatedAt: new Date() })
    .where(eq(assessmentTemplates.id, templateId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_template_updated",
    entityType: "assessment_template",
    entityId: templateId,
    details: {
      previousName: existing.name,
      newName: name,
      previousDescription: existing.description,
      newDescription: description || null,
    },
  });

  revalidateAssessments(templateId);
  return ok();
}

export async function publishAssessmentTemplate(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const templateId = getString(formData, "templateId");
  if (!templateId) return err("Template id is required.");

  const [template] = await db
    .select({ id: assessmentTemplates.id, status: assessmentTemplates.status })
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.id, templateId))
    .limit(1);

  if (!template) return err("Template not found.");
  if (template.status === "published") return ok();

  await db
    .update(assessmentTemplates)
    .set({
      status: "published",
      publishedAt: new Date(),
      updatedAt: new Date(),
      version: sql`${assessmentTemplates.version} + 1`,
    })
    .where(eq(assessmentTemplates.id, templateId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_template_published",
    entityType: "assessment_template",
    entityId: templateId,
    details: { previousStatus: template.status, newStatus: "published" },
  });

  revalidateAssessments(templateId);
  return ok();
}

export async function archiveAssessmentTemplate(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const templateId = getString(formData, "templateId");
  if (!templateId) return err("Template id is required.");

  const [template] = await db
    .select({ id: assessmentTemplates.id, status: assessmentTemplates.status })
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.id, templateId))
    .limit(1);

  if (!template) return err("Template not found.");
  if (template.status === "archived") return ok();

  await db
    .update(assessmentTemplates)
    .set({ status: "archived", updatedAt: new Date() })
    .where(eq(assessmentTemplates.id, templateId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_template_archived",
    entityType: "assessment_template",
    entityId: templateId,
    details: { previousStatus: template.status, newStatus: "archived" },
  });

  revalidateAssessments(templateId);
  return ok();
}

export async function deleteAssessmentTemplate(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const templateId = getString(formData, "templateId");
  if (!templateId) return err("Template id is required.");

  const [template] = await db
    .select({ id: assessmentTemplates.id, status: assessmentTemplates.status })
    .from(assessmentTemplates)
    .where(eq(assessmentTemplates.id, templateId))
    .limit(1);

  if (!template) return err("Template not found.");

  if (template.status === "published") {
    return err("Published templates cannot be deleted. Archive first.");
  }

  await db
    .delete(assessmentTemplates)
    .where(eq(assessmentTemplates.id, templateId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_template_deleted",
    entityType: "assessment_template",
    entityId: templateId,
  });

  revalidateAssessments();
  return ok();
}

// ─── Section mutations ──────────────────────────────────

export async function createAssessmentSection(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const templateId = getString(formData, "templateId");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const orderIndex = getNumber(formData, "orderIndex", 0);

  if (!templateId || !title) {
    return err("Template id and section title are required.");
  }

  const [section] = await db
    .insert(assessmentTemplateSections)
    .values({ templateId, title, description: description || null, orderIndex })
    .returning({ id: assessmentTemplateSections.id });

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_section_created",
    entityType: "assessment_section",
    entityId: section.id,
    details: { templateId, title, orderIndex },
  });

  revalidateAssessments(templateId);
  return ok();
}

export async function updateAssessmentSection(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const sectionId = getString(formData, "sectionId");
  const title = getString(formData, "title");
  const description = getString(formData, "description");
  const orderIndex = getNumber(formData, "orderIndex", 0);

  if (!sectionId || !title) {
    return err("Section id and title are required.");
  }

  const [existing] = await db
    .select()
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.id, sectionId))
    .limit(1);

  if (!existing) return err("Section not found.");

  await db
    .update(assessmentTemplateSections)
    .set({
      title,
      description: description || null,
      orderIndex,
      updatedAt: new Date(),
    })
    .where(eq(assessmentTemplateSections.id, sectionId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_section_updated",
    entityType: "assessment_section",
    entityId: sectionId,
    details: {
      templateId: existing.templateId,
      previousTitle: existing.title,
      newTitle: title,
      previousOrderIndex: existing.orderIndex,
      newOrderIndex: orderIndex,
    },
  });

  revalidateAssessments(existing.templateId);
  return ok();
}

export async function deleteAssessmentSection(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const sectionId = getString(formData, "sectionId");
  if (!sectionId) return err("Section id is required.");

  const [section] = await db
    .select({
      id: assessmentTemplateSections.id,
      templateId: assessmentTemplateSections.templateId,
    })
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.id, sectionId))
    .limit(1);

  if (!section) return err("Section not found.");

  await db
    .delete(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.id, sectionId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_section_deleted",
    entityType: "assessment_section",
    entityId: sectionId,
    details: { templateId: section.templateId },
  });

  revalidateAssessments(section.templateId);
  return ok();
}

// ─── Question mutations ─────────────────────────────────

export async function createAssessmentQuestion(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const sectionId = getString(formData, "sectionId");
  const questionKey = getString(formData, "questionKey");
  const prompt = getString(formData, "prompt");
  const description = getString(formData, "description");
  const inputType = getString(formData, "inputType") || "text";
  const optionsText = getString(formData, "options");
  const domain = getString(formData, "domain");
  const required = getBoolean(formData, "required", true);
  const weight = getNumber(formData, "weight", 1);
  const orderIndex = getNumber(formData, "orderIndex", 0);

  if (!sectionId || !questionKey || !prompt) {
    return err("Section, question key, and prompt are required.");
  }

  const parsedOptions = parseJsonInput(optionsText);
  if (parsedOptions === undefined) {
    return err("Options must be valid JSON.");
  }

  const [section] = await db
    .select({ templateId: assessmentTemplateSections.templateId })
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.id, sectionId))
    .limit(1);

  if (!section) return err("Section not found.");

  const [question] = await db
    .insert(assessmentTemplateQuestions)
    .values({
      sectionId,
      questionKey,
      prompt,
      description: description || null,
      inputType,
      options: parsedOptions,
      domain: domain || null,
      required,
      weight,
      orderIndex,
    })
    .returning({ id: assessmentTemplateQuestions.id });

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_question_created",
    entityType: "assessment_question",
    entityId: question.id,
    details: { templateId: section.templateId, sectionId, questionKey },
  });

  revalidateAssessments(section.templateId);
  return ok();
}

export async function updateAssessmentQuestion(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const questionId = getString(formData, "questionId");
  const questionKey = getString(formData, "questionKey");
  const prompt = getString(formData, "prompt");
  const description = getString(formData, "description");
  const inputType = getString(formData, "inputType") || "text";
  const optionsText = getString(formData, "options");
  const domain = getString(formData, "domain");
  const required = getBoolean(formData, "required", true);
  const weight = getNumber(formData, "weight", 1);
  const orderIndex = getNumber(formData, "orderIndex", 0);

  if (!questionId || !questionKey || !prompt) {
    return err("Question id, key, and prompt are required.");
  }

  const parsedOptions = parseJsonInput(optionsText);
  if (parsedOptions === undefined) {
    return err("Options must be valid JSON.");
  }

  const [existing] = await db
    .select({
      id: assessmentTemplateQuestions.id,
      sectionId: assessmentTemplateQuestions.sectionId,
      questionKey: assessmentTemplateQuestions.questionKey,
    })
    .from(assessmentTemplateQuestions)
    .where(eq(assessmentTemplateQuestions.id, questionId))
    .limit(1);

  if (!existing) return err("Question not found.");

  const [section] = await db
    .select({ templateId: assessmentTemplateSections.templateId })
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.id, existing.sectionId))
    .limit(1);

  if (!section) return err("Section not found.");

  await db
    .update(assessmentTemplateQuestions)
    .set({
      questionKey,
      prompt,
      description: description || null,
      inputType,
      options: parsedOptions,
      domain: domain || null,
      required,
      weight,
      orderIndex,
      updatedAt: new Date(),
    })
    .where(eq(assessmentTemplateQuestions.id, questionId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_question_updated",
    entityType: "assessment_question",
    entityId: questionId,
    details: {
      templateId: section.templateId,
      previousQuestionKey: existing.questionKey,
      newQuestionKey: questionKey,
    },
  });

  revalidateAssessments(section.templateId);
  return ok();
}

export async function deleteAssessmentQuestion(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const questionId = getString(formData, "questionId");
  if (!questionId) return err("Question id is required.");

  const [question] = await db
    .select({
      id: assessmentTemplateQuestions.id,
      sectionId: assessmentTemplateQuestions.sectionId,
    })
    .from(assessmentTemplateQuestions)
    .where(eq(assessmentTemplateQuestions.id, questionId))
    .limit(1);

  if (!question) return err("Question not found.");

  const [section] = await db
    .select({ templateId: assessmentTemplateSections.templateId })
    .from(assessmentTemplateSections)
    .where(eq(assessmentTemplateSections.id, question.sectionId))
    .limit(1);

  if (!section) return err("Section not found.");

  await db
    .delete(assessmentTemplateQuestions)
    .where(eq(assessmentTemplateQuestions.id, questionId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_question_deleted",
    entityType: "assessment_question",
    entityId: questionId,
    details: { templateId: section.templateId },
  });

  revalidateAssessments(section.templateId);
  return ok();
}

// ─── Rule mutations ─────────────────────────────────────

export async function createAssessmentRule(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const templateId = getString(formData, "templateId");
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const conditionText = getString(formData, "condition");
  const severity = getString(formData, "severity") as
    | "critical"
    | "high"
    | "medium"
    | "low"
    | "info";
  const resolutionPath = getString(formData, "resolutionPath") as
    | "self_serve"
    | "document_generation"
    | "expert_referral";
  const recommendationTitle = getString(formData, "recommendationTitle");
  const recommendationDescription = getString(
    formData,
    "recommendationDescription"
  );
  const priority = getNumber(formData, "priority", 0);

  if (
    !templateId ||
    !name ||
    !conditionText ||
    !severity ||
    !resolutionPath ||
    !recommendationTitle ||
    !recommendationDescription
  ) {
    return err("All required rule fields must be provided.");
  }

  const parsedCondition = parseJsonInput(conditionText);
  if (parsedCondition === undefined || parsedCondition === null) {
    return err("Condition must be valid JSON.");
  }

  const [rule] = await db
    .insert(assessmentTemplateRules)
    .values({
      templateId,
      name,
      description: description || null,
      condition: parsedCondition,
      severity,
      resolutionPath,
      recommendationTitle,
      recommendationDescription,
      priority,
    })
    .returning({ id: assessmentTemplateRules.id });

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_rule_created",
    entityType: "assessment_rule",
    entityId: rule.id,
    details: { templateId, name },
  });

  revalidateAssessments(templateId);
  return ok();
}

export async function updateAssessmentRule(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const ruleId = getString(formData, "ruleId");
  const name = getString(formData, "name");
  const description = getString(formData, "description");
  const conditionText = getString(formData, "condition");
  const severity = getString(formData, "severity") as
    | "critical"
    | "high"
    | "medium"
    | "low"
    | "info";
  const resolutionPath = getString(formData, "resolutionPath") as
    | "self_serve"
    | "document_generation"
    | "expert_referral";
  const recommendationTitle = getString(formData, "recommendationTitle");
  const recommendationDescription = getString(
    formData,
    "recommendationDescription"
  );
  const priority = getNumber(formData, "priority", 0);

  if (
    !ruleId ||
    !name ||
    !conditionText ||
    !severity ||
    !resolutionPath ||
    !recommendationTitle ||
    !recommendationDescription
  ) {
    return err("All required rule fields must be provided.");
  }

  const parsedCondition = parseJsonInput(conditionText);
  if (parsedCondition === undefined || parsedCondition === null) {
    return err("Condition must be valid JSON.");
  }

  const [existing] = await db
    .select({
      id: assessmentTemplateRules.id,
      templateId: assessmentTemplateRules.templateId,
    })
    .from(assessmentTemplateRules)
    .where(eq(assessmentTemplateRules.id, ruleId))
    .limit(1);

  if (!existing) return err("Rule not found.");

  await db
    .update(assessmentTemplateRules)
    .set({
      name,
      description: description || null,
      condition: parsedCondition,
      severity,
      resolutionPath,
      recommendationTitle,
      recommendationDescription,
      priority,
      updatedAt: new Date(),
    })
    .where(eq(assessmentTemplateRules.id, ruleId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_rule_updated",
    entityType: "assessment_rule",
    entityId: ruleId,
    details: { templateId: existing.templateId, name },
  });

  revalidateAssessments(existing.templateId);
  return ok();
}

export async function deleteAssessmentRule(
  _prev: ActionState,
  formData: FormData
): Promise<ActionState> {
  const admin = await requireActiveAdmin();

  const ruleId = getString(formData, "ruleId");
  if (!ruleId) return err("Rule id is required.");

  const [rule] = await db
    .select({
      id: assessmentTemplateRules.id,
      templateId: assessmentTemplateRules.templateId,
    })
    .from(assessmentTemplateRules)
    .where(eq(assessmentTemplateRules.id, ruleId))
    .limit(1);

  if (!rule) return err("Rule not found.");

  await db
    .delete(assessmentTemplateRules)
    .where(eq(assessmentTemplateRules.id, ruleId));

  await createAuditEntry({
    adminUserId: admin.id,
    action: "admin_assessment_rule_deleted",
    entityType: "assessment_rule",
    entityId: ruleId,
    details: { templateId: rule.templateId },
  });

  revalidateAssessments(rule.templateId);
  return ok();
}

// ─── Read-only helpers ──────────────────────────────────

export async function getTemplateStatusCounts() {
  await requireActiveAdmin();

  const counts = await db
    .select({
      status: assessmentTemplates.status,
      count: sql<number>`count(*)::int`,
    })
    .from(assessmentTemplates)
    .groupBy(assessmentTemplates.status);

  const result: Record<TemplateStatus, number> = {
    draft: 0,
    published: 0,
    archived: 0,
  };

  for (const entry of counts) {
    result[entry.status] = entry.count;
  }

  return result;
}

export async function getRecentAdminAuditEvents(limit = 20) {
  await requireActiveAdmin();

  return db
    .select({
      id: auditLog.id,
      action: auditLog.action,
      entityType: auditLog.entityType,
      entityId: auditLog.entityId,
      details: auditLog.details,
      createdAt: auditLog.createdAt,
      actorEmail: users.email,
    })
    .from(auditLog)
    .leftJoin(users, eq(users.id, auditLog.userId))
    .where(ilike(auditLog.action, "admin_%"))
    .orderBy(desc(auditLog.createdAt))
    .limit(limit);
}
