
//export const schema = null

import { relations } from "drizzle-orm";
import { pgTable, text, timestamp , integer, real, pgEnum } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";
import { randomUUID } from "crypto";
import { OrderMethod } from "@/app/type";

export const orderMethodEnum = pgEnum("orderMethod", ["manual","api"])

export const store = pgTable("store", {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
    description: text("description"),
    logo: text("logo"),
    owner_id: text("owner_id").notNull().references(() => user.id, { onDelete: "cascade" }),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const storeRelation = relations(store , ({many}) =>({
    items: many(item),
    orders: many(order),
}));

export const item = pgTable("item", {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    name: text("name").notNull(),
    picture: text("picture").notNull(),
    store_id: text("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(0),
    sale_price : real("sale_price").notNull(),
    cost_price : real("cost_price").notNull(),
    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const itemRelation = relations(item , ({one , many}) =>({
    store: one(store, {
        fields: [item.store_id,],
        references: [store.id,],
    }),
    orders: many(order),
}));

export const order = pgTable("order", {
    id: text("id").primaryKey().$defaultFn(() => randomUUID()),
    item_id: text("item_id").notNull().references(() => item.id, { onDelete: "cascade" }),
    store_id: text("store_id").notNull().references(() => store.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull(),
    price_per_unit: real("price_per_unit").notNull(),
    cost_per_unit: real("cost_per_unit").notNull(),
    method : orderMethodEnum("method").notNull().$type<OrderMethod>(),
    created_at: timestamp("created_at").notNull().defaultNow(),
});

export const orderRelation = relations(order , ({one}) =>({
    item: one(item, {
        fields: [order.item_id,],
        references: [item.id,],
    }),
    store: one(store, {
        fields: [order.store_id,],
        references: [store.id,],
    }),
}));
