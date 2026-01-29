CREATE TYPE "public"."cancel_actor_type" AS ENUM('user', 'admin', 'system');--> statement-breakpoint
CREATE TYPE "public"."reservation_status" AS ENUM('pending', 'approved', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TABLE "reservations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"public_code" text NOT NULL,
	"requester_name" text NOT NULL,
	"requester_phone" text NOT NULL,
	"organization" text NOT NULL,
	"purpose" text NOT NULL,
	"destination" text NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"status" "reservation_status" DEFAULT 'pending' NOT NULL,
	"cancelled_at" timestamp with time zone,
	"cancel_actor_type" "cancel_actor_type",
	"cancel_reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	CONSTRAINT "reservations_public_code_unique" UNIQUE("public_code")
);
