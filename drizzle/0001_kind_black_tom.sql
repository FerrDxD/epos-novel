CREATE TABLE "usage_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"codex_id" uuid,
	"import_log_id" uuid,
	"action" text NOT NULL,
	"input_chars" integer DEFAULT 0 NOT NULL,
	"estimated_tokens" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "import_logs" ADD COLUMN "error_message" text;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_codex_id_codexes_id_fk" FOREIGN KEY ("codex_id") REFERENCES "public"."codexes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_logs" ADD CONSTRAINT "usage_logs_import_log_id_import_logs_id_fk" FOREIGN KEY ("import_log_id") REFERENCES "public"."import_logs"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "usage_logs_user_idx" ON "usage_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "usage_logs_created_idx" ON "usage_logs" USING btree ("created_at");