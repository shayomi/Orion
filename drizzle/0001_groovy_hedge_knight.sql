CREATE TYPE "public"."assessment_template_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('member', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'suspended');--> statement-breakpoint
CREATE TABLE "assessment_template_questions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"section_id" uuid NOT NULL,
	"question_key" varchar(255) NOT NULL,
	"prompt" text NOT NULL,
	"description" text,
	"input_type" varchar(50) DEFAULT 'text' NOT NULL,
	"options" jsonb,
	"domain" varchar(255),
	"required" boolean DEFAULT true NOT NULL,
	"weight" integer DEFAULT 1 NOT NULL,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_template_rules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"condition" jsonb NOT NULL,
	"severity" "severity" NOT NULL,
	"resolution_path" "resolution_path" NOT NULL,
	"recommendation_title" varchar(500) NOT NULL,
	"recommendation_description" text NOT NULL,
	"priority" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_template_sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"template_id" uuid NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"order_index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"description" text,
	"status" "assessment_template_status" DEFAULT 'draft' NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"published_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'member' NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "status" "user_status" DEFAULT 'active' NOT NULL;--> statement-breakpoint
ALTER TABLE "assessment_template_questions" ADD CONSTRAINT "assessment_template_questions_section_id_assessment_template_sections_id_fk" FOREIGN KEY ("section_id") REFERENCES "public"."assessment_template_sections"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_template_rules" ADD CONSTRAINT "assessment_template_rules_template_id_assessment_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_template_sections" ADD CONSTRAINT "assessment_template_sections_template_id_assessment_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "assessment_templates" ADD CONSTRAINT "assessment_templates_created_by_user_id_users_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;