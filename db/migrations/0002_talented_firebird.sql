ALTER TYPE "public"."usage_status" ADD VALUE 'inspected' BEFORE 'no_show';--> statement-breakpoint
ALTER TABLE "usage_sessions" ADD COLUMN "inspected_at" timestamp with time zone;