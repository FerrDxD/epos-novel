CREATE TYPE "public"."category" AS ENUM('characters', 'locations', 'factions', 'events', 'concepts', 'monsters');--> statement-breakpoint
CREATE TYPE "public"."import_status" AS ENUM('pending', 'processing', 'done', 'failed');--> statement-breakpoint
CREATE TYPE "public"."source_type" AS ENUM('docx', 'pdf', 'md', 'json', 'gdocs', 'gdrive');--> statement-breakpoint
ALTER TABLE "entries" ALTER COLUMN "category" SET DATA TYPE "public"."category" USING "category"::"public"."category";--> statement-breakpoint
CREATE INDEX "entries_codex_idx" ON "entries" USING btree ("codex_id");--> statement-breakpoint
CREATE INDEX "entries_user_idx" ON "entries" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "entries_category_idx" ON "entries" USING btree ("category");--> statement-breakpoint
CREATE INDEX "entries_codex_category_idx" ON "entries" USING btree ("codex_id","category");--> statement-breakpoint
CREATE INDEX "relations_codex_idx" ON "relations" USING btree ("codex_id");--> statement-breakpoint
CREATE INDEX "relations_source_idx" ON "relations" USING btree ("source_entry_id");--> statement-breakpoint
CREATE INDEX "relations_target_idx" ON "relations" USING btree ("target_entry_id");--> statement-breakpoint
CREATE INDEX "import_logs_user_idx" ON "import_logs" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "import_logs_codex_idx" ON "import_logs" USING btree ("codex_id");