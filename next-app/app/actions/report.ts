"use server";
import { db } from "@/app/lib/drizzle";
import { store, order, item } from "@/db/schema";
import { eq, sql, and, gte, lte, desc } from "drizzle-orm";
import {YearlyReportData} from "@/app/type";

export async function getYearlyReport(
    storeId: string,
    year: number
):  Promise<YearlyReportData> {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    // Get store name
    const storeData = await db
        .select({ name: store.name })
        .from(store)
        .where(eq(store.id, storeId))
        .limit(1);

    const storeOverview = await db
        .select({
            revenue: sql<number>`COALESCE(SUM(${order.quantity} * ${order.price_per_unit}), 0)`,
            cost: sql<number>`COALESCE(SUM(${order.quantity} * ${order.cost_per_unit}), 0)`,
            totalOrders: sql<number>`COUNT(*)`,
        })
        .from(order)
        .where(
        and(
            eq(order.store_id, storeId),
            gte(order.created_at, startDate),
            lte(order.created_at, endDate)
        )
        );

    const overview = storeOverview[0] || { revenue: 0, cost: 0, totalOrders: 0 };

    const methodBreakdown = await db
        .select({
            method: order.method,
            revenue: sql<number>`COALESCE(SUM(${order.quantity} * ${order.price_per_unit}), 0)`,
            cost: sql<number>`COALESCE(SUM(${order.quantity} * ${order.cost_per_unit}), 0)`,
            orderCount: sql<number>`COUNT(*)`,
        })
        .from(order)
        .where(
            and(
                eq(order.store_id, storeId),
                gte(order.created_at, startDate),
                lte(order.created_at, endDate)
            )
        )
        .groupBy(order.method);

    const manualData = methodBreakdown.find((m) => m.method === "manual") || {
        revenue: 0,
        cost: 0,
        orderCount: 0,
    };
    const apiData = methodBreakdown.find((m) => m.method === "api") || {
        revenue: 0,
        cost: 0,
        orderCount: 0,
    };

    const topItems = await db
        .select({
            itemId: item.id,
            itemName: item.name,
            itemPicture: item.picture,
            revenue: sql<number>`SUM(${order.quantity} * ${order.price_per_unit})`,
            cost: sql<number>`SUM(${order.quantity} * ${order.cost_per_unit})`,
            quantitySold: sql<number>`SUM(${order.quantity})`,
        })
        .from(order)
        .innerJoin(item, eq(order.item_id, item.id))
        .where(
        and(
            eq(order.store_id, storeId),
            gte(order.created_at, startDate),
            lte(order.created_at, endDate)
        )
        )
        .groupBy(item.id, item.name, item.picture)
        .orderBy(desc(sql`SUM(${order.quantity} * ${order.price_per_unit})`))
        .limit(5);

    return {
        storeOverview: {
            revenue: overview.revenue,
            cost: overview.cost,
            profit: overview.revenue - overview.cost,
            totalOrders: overview.totalOrders,
        },
        byMethod: {
            manual: {
                revenue: manualData.revenue,
                cost: manualData.cost,
                profit: manualData.revenue - manualData.cost,
                orderCount: manualData.orderCount,
            },
            api: {
                revenue: apiData.revenue,
                cost: apiData.cost,
                profit: apiData.revenue - apiData.cost,
                orderCount: apiData.orderCount,
            },
        },
        topItems: topItems.map((item) => ({
            ...item,
            profit: item.revenue - item.cost,
        })),
        storeName: storeData[0]?.name || "Store",
        year,
    };
}

export async function getYearlyReportData(storeId: string, year: number) {
    try {
        const report = await getYearlyReport(storeId, year);
        return {
            success: true,
            data: report,
        };
    } catch (error) {
        console.error("Error fetching report:", error);
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch report",
        };
    }
}