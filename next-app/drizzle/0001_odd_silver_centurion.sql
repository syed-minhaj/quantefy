CREATE TYPE "public"."orderMethod" AS ENUM('mannul', 'api');--> statement-breakpoint
CREATE TABLE "item" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"picture" text,
	"store_id" text NOT NULL,
	"quantity" integer DEFAULT 0 NOT NULL,
	"sale_price" real NOT NULL,
	"cost_price" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "order" (
	"id" text PRIMARY KEY NOT NULL,
	"item_id" text NOT NULL,
	"quantity" text NOT NULL,
	"total_price" real NOT NULL,
	"method" "orderMethod" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "store" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	"logo" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
