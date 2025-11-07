ALTER TABLE "order" ALTER COLUMN "method" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."orderMethod";--> statement-breakpoint
CREATE TYPE "public"."orderMethod" AS ENUM('manual', 'api');--> statement-breakpoint
ALTER TABLE "order" ALTER COLUMN "method" SET DATA TYPE "public"."orderMethod" USING "method"::"public"."orderMethod";