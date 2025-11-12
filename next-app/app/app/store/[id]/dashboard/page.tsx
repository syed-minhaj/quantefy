import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { item, store , order } from "@/db/schema";
import { db } from "@/app/lib/drizzle";
import { asc, eq } from "drizzle-orm";
import { Info } from "./components/info";
import { RevenueChart } from "./components/revenueChart";
import { ChartBarLabel } from "./components/barchart";
import { Suspense } from "react";


async function Main({storeID}:{storeID:string}) {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) redirect("/app/auth/sign-In");
    const stores = await db.select().from(store).where(eq(store.id,storeID));
    if (!stores.length) redirect("/app/store");
    if (stores[0].owner_id != session.user.id) redirect("/app/store");
    const items = await db.select().from(item).where(eq(item.store_id,storeID));
    const orders = await db.query.order.findMany({
        where : eq(order.store_id,storeID),
        with : {
            item : true,
        },
        orderBy : [asc(order.created_at)]
    })

    function getRevenueData() {
        const revenueData: { date: string; revenue: number }[] = []
        orders.forEach((order) => {
            const date = new Date(order.created_at)
            const year = date.getFullYear().toString()
            const month = date.toLocaleString("en-US", { month: "short" }).toLowerCase()
            const day = date.getDate().toString().padStart(2, "0")
            const dateString = `${month}-${day}-${year}`
            revenueData.push({
                date: dateString,
                revenue: order.price_per_unit * order.quantity,
            })
        })
        return revenueData
    }

    function getBarChartData(){
        const barChartData:{item:string , revenue:number}[] = []
        orders.forEach((order) => {
            if(barChartData.find((item)=>item.item == order.item.name)) {
                const index = barChartData.findIndex((item)=>item.item == order.item.name)
                barChartData[index].revenue += order.price_per_unit * order.quantity
            }else{
                barChartData.push({
                    item: order.item.name,
                    revenue: order.price_per_unit * order.quantity,
                })
            }
        })
        return barChartData
    }

    return (
        <div className="flex flex-col gap-4 mb-4  ">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Info heading="Number of Items" value={items.length.toString()} />
                <Info heading="Revenue" value={"$"+orders.reduce((a,b)=>a+b.price_per_unit*b.quantity,0).toFixed(2)} />
                <Info heading="Profit" value={"$"+orders.reduce((a,b)=>a+b.quantity*(b.price_per_unit-b.cost_per_unit),0).toFixed(2)} />
                <Info heading="Low Stock" value={items.filter((item)=>item.quantity < 10).length.toString()} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RevenueChart data={getRevenueData()} />
                <ChartBarLabel chartData={getBarChartData()} />
            </div>
        </div>
    )
}


function DashboardSkeleton() {
    return (
        <div className="grid grid-cols-2 gap-4 mb-4 animate-pulse">
            <div className=" flex flex-col gap-4 w-full ">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full bg-bg2 rounded-r1 border border-input h-24.5 p-4 "/>
                    <div className="w-full bg-bg2 rounded-r1 border border-input h-24.5 p-4 "/>
                </div>
                <div className="w-full bg-bg2 rounded-r1 border border-input h-96 p-4 "/>
            </div>
            <div className=" flex flex-col gap-4 w-full ">
                <div className="grid grid-cols-2 gap-4">
                    <div className="w-full bg-bg2 rounded-r1 border border-input h-24.5 p-4 "/>
                    <div className="w-full bg-bg2 rounded-r1 border border-input h-24.5 p-4 "/>
                </div>
                <div className="w-full bg-bg2 rounded-r1 border border-input h-96 p-4 "/>
            </div>
        </div>
    )
}

export default async function Dashboard({params}:{params:any}) {
    const { id } = await params;
    return (
        <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden">
            <div className="flex flex-row items-center">
                <h1 className="text-xl font-semibold">Dashboard</h1>
            </div>
            <Suspense fallback={<DashboardSkeleton/>}>
                <Main storeID={id} />
            </Suspense>
        </div>
    )
}