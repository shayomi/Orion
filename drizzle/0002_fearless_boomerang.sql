ALTER TABLE "assessments" ADD COLUMN "template_id" uuid;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "assessment_id" uuid;--> statement-breakpoint
ALTER TABLE "uploads" ADD COLUMN "question_key" varchar(255);--> statement-breakpoint
ALTER TABLE "assessments" ADD CONSTRAINT "assessments_template_id_assessment_templates_id_fk" FOREIGN KEY ("template_id") REFERENCES "public"."assessment_templates"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "uploads" ADD CONSTRAINT "uploads_assessment_id_assessments_id_fk" FOREIGN KEY ("assessment_id") REFERENCES "public"."assessments"("id") ON DELETE set null ON UPDATE no action;