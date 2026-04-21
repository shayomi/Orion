import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  integer,
  boolean,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── Enums ───────────────────────────────────────────────

export const startupStageEnum = pgEnum("startup_stage", [
  "idea",
  "pre_seed",
  "seed",
  "series_a",
  "series_b",
  "growth",
]);

export const assessmentStatusEnum = pgEnum("assessment_status", [
  "in_progress",
  "completed",
  "expired",
]);

export const severityEnum = pgEnum("severity", [
  "critical",
  "high",
  "medium",
  "low",
  "info",
]);

export const resolutionPathEnum = pgEnum("resolution_path", [
  "self_serve",
  "document_generation",
  "expert_referral",
]);

export const documentStatusEnum = pgEnum("document_status", [
  "draft",
  "generating",
  "ready",
  "signed",
  "expired",
]);

export const referralStatusEnum = pgEnum("referral_status", [
  "requested",
  "matched",
  "in_progress",
  "resolved",
  "cancelled",
]);

export const userRoleEnum = pgEnum("user_role", ["member", "admin"]);

export const userStatusEnum = pgEnum("user_status", ["active", "suspended"]);

export const assessmentTemplateStatusEnum = pgEnum("assessment_template_status", [
  "draft",
  "published",
  "archived",
]);

// ─── NextAuth Required Tables ────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: userRoleEnum("role").default("member").notNull(),
  status: userStatusEnum("status").default("active").notNull(),
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  type: varchar("type", { length: 255 }).notNull(),
  provider: varchar("provider", { length: 255 }).notNull(),
  providerAccountId: varchar("provider_account_id", { length: 255 }).notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: varchar("token_type", { length: 255 }),
  scope: varchar("scope", { length: 255 }),
  id_token: text("id_token"),
  session_state: varchar("session_state", { length: 255 }),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sessionToken: varchar("session_token", { length: 255 }).notNull().unique(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verification_tokens", {
  identifier: varchar("identifier", { length: 255 }).notNull(),
  token: varchar("token", { length: 255 }).notNull().unique(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

// ─── Startups ────────────────────────────────────────────

export const startups = pgTable("startups", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  stage: startupStageEnum("stage"),
  structure: varchar("structure", { length: 255 }), // e.g. "Delaware C-Corp"
  primaryJurisdiction: varchar("primary_jurisdiction", { length: 255 }),
  fundingStatus: varchar("funding_status", { length: 255 }),
  teamSize: integer("team_size"),
  incorporatedAt: timestamp("incorporated_at", { mode: "date" }),
  riskScore: integer("risk_score"),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Entity Structures (multi-jurisdiction) ──────────────

export const entityStructures = pgTable("entity_structures", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  entityName: varchar("entity_name", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 255 }).notNull(), // LLC, C-Corp, Ltd, etc.
  jurisdiction: varchar("jurisdiction", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }), // holding, operating, ip_holder
  incorporatedAt: timestamp("incorporated_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Assessments (Legal Health Check) ────────────────────

export const assessments = pgTable("assessments", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  status: assessmentStatusEnum("status").default("in_progress").notNull(),
  overallScore: integer("overall_score"),
  riskLevel: severityEnum("risk_level"),
  completedAt: timestamp("completed_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const assessmentResponses = pgTable("assessment_responses", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  questionId: varchar("question_id", { length: 255 }).notNull(),
  questionText: text("question_text").notNull(),
  answer: jsonb("answer").notNull(), // flexible: string, array, object
  domain: varchar("domain", { length: 255 }), // e.g. "incorporation", "equity", "ip"
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Legal Issues ────────────────────────────────────────

export const legalIssues = pgTable("legal_issues", {
  id: uuid("id").defaultRandom().primaryKey(),
  assessmentId: uuid("assessment_id")
    .notNull()
    .references(() => assessments.id, { onDelete: "cascade" }),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  domain: varchar("domain", { length: 255 }).notNull(),
  severity: severityEnum("severity").notNull(),
  resolutionPath: resolutionPathEnum("resolution_path").notNull(),
  isResolved: boolean("is_resolved").default(false).notNull(),
  resolvedAt: timestamp("resolved_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Recommendations ─────────────────────────────────────

export const recommendations = pgTable("recommendations", {
  id: uuid("id").defaultRandom().primaryKey(),
  issueId: uuid("issue_id")
    .notNull()
    .references(() => legalIssues.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description").notNull(),
  actionType: resolutionPathEnum("action_type").notNull(),
  priority: integer("priority").default(0).notNull(), // lower = higher priority
  metadata: jsonb("metadata"), // template ID, provider info, etc.
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Documents ───────────────────────────────────────────

export const documents = pgTable("documents", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 500 }).notNull(),
  type: varchar("type", { length: 255 }).notNull(), // NDA, founder_agreement, etc.
  status: documentStatusEnum("status").default("draft").notNull(),
  templateId: varchar("template_id", { length: 255 }),
  inputData: jsonb("input_data"), // user-provided form data
  content: text("content"), // generated document content
  storageKey: text("storage_key"), // R2 object key
  mimeType: varchar("mime_type", { length: 255 }),
  fileSize: integer("file_size"),
  jurisdiction: varchar("jurisdiction", { length: 255 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Referrals ───────────────────────────────────────────

export const referrals = pgTable("referrals", {
  id: uuid("id").defaultRandom().primaryKey(),
  issueId: uuid("issue_id")
    .notNull()
    .references(() => legalIssues.id, { onDelete: "cascade" }),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  status: referralStatusEnum("status").default("requested").notNull(),
  issueSummary: text("issue_summary").notNull(),
  providerNotes: text("provider_notes"),
  resolvedAt: timestamp("resolved_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Assessment Builder Templates ───────────────────────

export const assessmentTemplates = pgTable("assessment_templates", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  status: assessmentTemplateStatusEnum("status").default("draft").notNull(),
  version: integer("version").default(1).notNull(),
  createdByUserId: uuid("created_by_user_id")
    .notNull()
    .references(() => users.id, { onDelete: "restrict" }),
  publishedAt: timestamp("published_at", { mode: "date" }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const assessmentTemplateSections = pgTable("assessment_template_sections", {
  id: uuid("id").defaultRandom().primaryKey(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => assessmentTemplates.id, { onDelete: "cascade" }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const assessmentTemplateQuestions = pgTable("assessment_template_questions", {
  id: uuid("id").defaultRandom().primaryKey(),
  sectionId: uuid("section_id")
    .notNull()
    .references(() => assessmentTemplateSections.id, { onDelete: "cascade" }),
  questionKey: varchar("question_key", { length: 255 }).notNull(),
  prompt: text("prompt").notNull(),
  description: text("description"),
  inputType: varchar("input_type", { length: 50 }).default("text").notNull(),
  options: jsonb("options"),
  domain: varchar("domain", { length: 255 }),
  required: boolean("required").default(true).notNull(),
  weight: integer("weight").default(1).notNull(),
  orderIndex: integer("order_index").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

export const assessmentTemplateRules = pgTable("assessment_template_rules", {
  id: uuid("id").defaultRandom().primaryKey(),
  templateId: uuid("template_id")
    .notNull()
    .references(() => assessmentTemplates.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  condition: jsonb("condition").notNull(),
  severity: severityEnum("severity").notNull(),
  resolutionPath: resolutionPathEnum("resolution_path").notNull(),
  recommendationTitle: varchar("recommendation_title", { length: 500 }).notNull(),
  recommendationDescription: text("recommendation_description").notNull(),
  priority: integer("priority").default(0).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Chat History (AI Conversations) ─────────────────────

export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  role: varchar("role", { length: 50 }).notNull(), // "user" | "assistant"
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // context injected, tokens used, etc.
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Uploads (user-uploaded files) ──────────────────────

export const uploads = pgTable("uploads", {
  id: uuid("id").defaultRandom().primaryKey(),
  startupId: uuid("startup_id")
    .notNull()
    .references(() => startups.id, { onDelete: "cascade" }),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 500 }).notNull(),
  storageKey: text("storage_key").notNull(),
  mimeType: varchar("mime_type", { length: 255 }).notNull(),
  fileSize: integer("file_size"),
  domain: varchar("domain", { length: 255 }), // e.g. "incorporation", "equity"
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Audit Log ───────────────────────────────────────────

export const auditLog = pgTable("audit_log", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  action: varchar("action", { length: 255 }).notNull(),
  entityType: varchar("entity_type", { length: 255 }).notNull(), // "assessment", "document", etc.
  entityId: uuid("entity_id"),
  details: jsonb("details"),
  ipAddress: varchar("ip_address", { length: 45 }),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
});

// ─── Relations ───────────────────────────────────────────

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  startups: many(startups),
  documents: many(documents),
  uploads: many(uploads),
  referrals: many(referrals),
  chatMessages: many(chatMessages),
  auditLogs: many(auditLog),
  assessmentTemplates: many(assessmentTemplates),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const startupsRelations = relations(startups, ({ one, many }) => ({
  user: one(users, { fields: [startups.userId], references: [users.id] }),
  entityStructures: many(entityStructures),
  assessments: many(assessments),
  legalIssues: many(legalIssues),
  documents: many(documents),
  uploads: many(uploads),
  referrals: many(referrals),
  chatMessages: many(chatMessages),
}));

export const entityStructuresRelations = relations(entityStructures, ({ one }) => ({
  startup: one(startups, { fields: [entityStructures.startupId], references: [startups.id] }),
}));

export const assessmentsRelations = relations(assessments, ({ one, many }) => ({
  startup: one(startups, { fields: [assessments.startupId], references: [startups.id] }),
  responses: many(assessmentResponses),
  legalIssues: many(legalIssues),
}));

export const assessmentResponsesRelations = relations(assessmentResponses, ({ one }) => ({
  assessment: one(assessments, { fields: [assessmentResponses.assessmentId], references: [assessments.id] }),
}));

export const legalIssuesRelations = relations(legalIssues, ({ one, many }) => ({
  assessment: one(assessments, { fields: [legalIssues.assessmentId], references: [assessments.id] }),
  startup: one(startups, { fields: [legalIssues.startupId], references: [startups.id] }),
  recommendations: many(recommendations),
  referrals: many(referrals),
}));

export const recommendationsRelations = relations(recommendations, ({ one }) => ({
  issue: one(legalIssues, { fields: [recommendations.issueId], references: [legalIssues.id] }),
}));

export const documentsRelations = relations(documents, ({ one }) => ({
  startup: one(startups, { fields: [documents.startupId], references: [startups.id] }),
  user: one(users, { fields: [documents.userId], references: [users.id] }),
}));

export const referralsRelations = relations(referrals, ({ one }) => ({
  issue: one(legalIssues, { fields: [referrals.issueId], references: [legalIssues.id] }),
  startup: one(startups, { fields: [referrals.startupId], references: [startups.id] }),
  user: one(users, { fields: [referrals.userId], references: [users.id] }),
}));

export const assessmentTemplatesRelations = relations(assessmentTemplates, ({ one, many }) => ({
  createdByUser: one(users, {
    fields: [assessmentTemplates.createdByUserId],
    references: [users.id],
  }),
  sections: many(assessmentTemplateSections),
  rules: many(assessmentTemplateRules),
}));

export const assessmentTemplateSectionsRelations = relations(
  assessmentTemplateSections,
  ({ one, many }) => ({
    template: one(assessmentTemplates, {
      fields: [assessmentTemplateSections.templateId],
      references: [assessmentTemplates.id],
    }),
    questions: many(assessmentTemplateQuestions),
  })
);

export const assessmentTemplateQuestionsRelations = relations(
  assessmentTemplateQuestions,
  ({ one }) => ({
    section: one(assessmentTemplateSections, {
      fields: [assessmentTemplateQuestions.sectionId],
      references: [assessmentTemplateSections.id],
    }),
  })
);

export const assessmentTemplateRulesRelations = relations(assessmentTemplateRules, ({ one }) => ({
  template: one(assessmentTemplates, {
    fields: [assessmentTemplateRules.templateId],
    references: [assessmentTemplates.id],
  }),
}));

export const chatMessagesRelations = relations(chatMessages, ({ one }) => ({
  user: one(users, { fields: [chatMessages.userId], references: [users.id] }),
  startup: one(startups, { fields: [chatMessages.startupId], references: [startups.id] }),
}));

export const uploadsRelations = relations(uploads, ({ one }) => ({
  startup: one(startups, { fields: [uploads.startupId], references: [startups.id] }),
  user: one(users, { fields: [uploads.userId], references: [users.id] }),
}));

export const auditLogRelations = relations(auditLog, ({ one }) => ({
  user: one(users, { fields: [auditLog.userId], references: [users.id] }),
}));
