ALTER TABLE "usage_sessions" ADD COLUMN "has_issue" boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE "usage_sessions" ADD COLUMN "issue_reported_at" timestamp with time zone;