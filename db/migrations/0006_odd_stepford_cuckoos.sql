ALTER TYPE "public"."audit_action" ADD VALUE 'reservation.close' BEFORE 'usage.checkout';--> statement-breakpoint
ALTER TYPE "public"."reservation_status" ADD VALUE 'closed';--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "entity_type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."audit_entity_type";--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type" AS ENUM('reservation', 'usage_session', 'vehicle', 'admin');--> statement-breakpoint
ALTER TABLE "audit_logs" ALTER COLUMN "entity_type" SET DATA TYPE "public"."audit_entity_type" USING "entity_type"::"public"."audit_entity_type";--> statement-breakpoint
ALTER TABLE "audit_logs" ADD COLUMN "reservation_id" uuid NOT NULL;--> statement-breakpoint
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_reservation_id_reservations_id_fk" FOREIGN KEY ("reservation_id") REFERENCES "public"."reservations"("id") ON DELETE cascade ON UPDATE no action;