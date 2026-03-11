-- CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('reservation_manager', 'vehicle_manager', 'super_admin');--> statement-breakpoint
-- CREATE TABLE "auth"."users" (
-- 	"id" uuid PRIMARY KEY NOT NULL,
-- 	"email" text
-- );
--> statement-breakpoint
CREATE TABLE "admin_profiles" (
	"id" uuid PRIMARY KEY NOT NULL,
	"role" "admin_role" DEFAULT 'vehicle_manager' NOT NULL,
	"name" text NOT NULL,
	"is_active" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
