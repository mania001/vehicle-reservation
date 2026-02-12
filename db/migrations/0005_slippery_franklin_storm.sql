CREATE TYPE "public"."audit_action" AS ENUM('reservation.approve', 'reservation.reject', 'reservation.cancel', 'usage.checkout', 'usage.return', 'usage.extend', 'usage.forceReturn', 'usage.inspect', 'vehicle.create', 'vehicle.update', 'vehicle.delete', 'admin.login', 'admin.logout');--> statement-breakpoint
CREATE TYPE "public"."audit_actor_type" AS ENUM('admin', 'system');--> statement-breakpoint
CREATE TYPE "public"."audit_entity_type" AS ENUM('reservation', 'usage', 'vehicle', 'admin_user');--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"action" "audit_action" NOT NULL,
	"entity_type" "audit_entity_type" NOT NULL,
	"entity_id" uuid NOT NULL,
	"actor_type" "audit_actor_type" NOT NULL,
	"actor_id" uuid,
	"message" text,
	"prev_data" jsonb,
	"next_data" jsonb,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
