CREATE TYPE "public"."fuel_level" AS ENUM('empty', 'quarter', 'half', 'three-quarter', 'full');--> statement-breakpoint
CREATE TYPE "public"."fuel_type" AS ENUM('gasoline', 'diesel', 'lpg', 'hybrid', 'electric');--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "priority" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "fuel_level" "fuel_level" DEFAULT 'full' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "fuel_type" "fuel_type" DEFAULT 'gasoline' NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "updated_at" timestamp with time zone DEFAULT now() NOT NULL;