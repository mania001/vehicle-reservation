ALTER TABLE "usage_session_checks" ADD COLUMN "is_fueled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "usage_session_checks" ADD COLUMN "fuel_amount" integer;--> statement-breakpoint
ALTER TABLE "usage_session_checks" ADD COLUMN "is_cleaned" boolean DEFAULT true;