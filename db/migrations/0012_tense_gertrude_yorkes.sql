CREATE TYPE "public"."check_type" AS ENUM('before_drive', 'after_drive', 'admin_inspect');--> statement-breakpoint
CREATE TABLE "usage_session_checks" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usage_session_id" uuid NOT NULL,
	"type" "check_type" NOT NULL,
	"mileage" integer,
	"fuel_level" integer,
	"parking_zone" text,
	"parking_number" text,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usage_session_check_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"check_id" uuid NOT NULL,
	"key" text NOT NULL,
	"value" boolean NOT NULL,
	"note" text,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "usage_session_photos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"usage_session_id" uuid NOT NULL,
	"check_id" uuid,
	"type" text NOT NULL,
	"url" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
-- ALTER TABLE "vehicles" ALTER COLUMN "fuel_level" SET DATA TYPE integer;--> statement-breakpoint
ALTER TABLE "vehicles" ALTER COLUMN "fuel_level" DROP DEFAULT;

ALTER TABLE "vehicles" ALTER COLUMN "fuel_level" TYPE integer USING (
  CASE 
    WHEN fuel_level = 'full' THEN 100
		WHEN fuel_level = 'three-quarter' THEN 75
    WHEN fuel_level = 'half' THEN 50
    WHEN fuel_level = 'quarter' THEN 25
		WHEN fuel_level = 'empty' THEN 0
    ELSE 0 
  END
);
ALTER TABLE "vehicles" ALTER COLUMN "fuel_level" SET DEFAULT 100;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "mileage" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "last_parking_zone" text;--> statement-breakpoint
ALTER TABLE "vehicles" ADD COLUMN "last_parking_number" text;--> statement-breakpoint
ALTER TABLE "usage_session_check_items" ADD CONSTRAINT "usage_session_check_items_check_id_usage_session_checks_id_fk" FOREIGN KEY ("check_id") REFERENCES "public"."usage_session_checks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "usage_session_photos" ADD CONSTRAINT "usage_session_photos_check_id_usage_session_checks_id_fk" FOREIGN KEY ("check_id") REFERENCES "public"."usage_session_checks"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
DROP TYPE "public"."fuel_level";