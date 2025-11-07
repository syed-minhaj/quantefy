ALTER TABLE "order" ADD COLUMN "price_per_unit" real NOT NULL;--> statement-breakpoint
ALTER TABLE "order" ADD COLUMN "cost_per_unit" real NOT NULL;--> statement-breakpoint
ALTER TABLE "order" DROP COLUMN "total_price";