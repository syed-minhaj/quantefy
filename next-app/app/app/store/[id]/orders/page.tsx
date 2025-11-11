import { auth } from "@/app/lib/auth";
import { db } from "@/app/lib/drizzle";
import { item, order, store } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import NewOrder from "./components/newOrders";
import { Table , TableBody, TableCell, TableHeader, TableRow } from "@/app/components/ui/table";
import OrderTable from "./components/orderTable";
import OrderDetals from "./components/orderDetals";

async function Main({storeID}:{storeID:string}) {

    const session = await auth.api.getSession({headers: await headers()});
    if (!session) redirect("/app/auth/sign-In");
    const stores = await db.select().from(store).where(eq(store.id,storeID));
    if (!stores.length) redirect("/app/store");
    if (stores[0].owner_id != session.user.id) redirect("/app/store");
    const orders = await db.query.order.findMany({
        where : eq(order.store_id,storeID),
        with : {
            item : true,
        },
        orderBy : [desc(order.created_at)]
    })
    

    return (
        <div className="flex flex-row  ">
            <OrderTable orders={orders} />
            <OrderDetals storeID={storeID} orders={orders} />
        </div>
    )
}

async function NewOrderS ({storeID}:{storeID:string}) {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) redirect("/app/auth/sign-In");
    const stores = await db.select().from(store).where(eq(store.id,storeID));
    if (!stores.length) redirect("/app/store");
    if (stores[0].owner_id != session.user.id) redirect("/app/store");
    const items = await db.select().from(item).where(eq(item.store_id,storeID));

    return (
        <NewOrder storeID={storeID} items={items} />
    )
}

function OrdersSkeleton() {
    return (
        <div className="rounded-r1 bg-bg2 border border-input overflow-hidden mb-10">
            <Table className="rounded-r1 bg-bg2 ">
                <TableHeader >
                    <TableRow  >
                        <TableCell className="w-24 font-medium">Image</TableCell>
                        <TableCell className="w-36 font-medium">Name</TableCell>
                        <TableCell className="w-24 font-medium">Price per unit</TableCell>
                        <TableCell className="w-24 font-medium">Cost per unit</TableCell>
                        <TableCell className="w-24 font-medium">Quantity</TableCell>
                        <TableCell className="w-24 font-medium">Total</TableCell>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array(7).fill(0).map((_, index) => (
                        <TableRow key={index} className="animate-pulse">
                            <TableCell className="w-24">
                                <div className="w-12 h-12 rounded-r1 bg-gray-200 object-contain border border-input" />
                            </TableCell>
                            <TableCell className="">
                                <div className=" bg-gray-200 h-6 w-3/5  "/>
                            </TableCell>
                            <TableCell className="">
                                <div className=" bg-gray-200 h-6 w-2/5 "/>
                            </TableCell>
                            <TableCell className="">
                                <div className=" bg-gray-200 h-6 w-2/5 "/>
                            </TableCell>
                            <TableCell className="">
                                <div className=" bg-gray-200 h-6 w-2/5 "/>
                            </TableCell>
                            <TableCell className="">
                                <div className=" bg-gray-200 h-6 w-3/5 "/>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default async function Orders({params}:{params:any}) {
    const { id } = await params;
    return (
        <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden">
            <div className="flex flex-row items-center ">
                <h1 className="text-xl font-semibold">Orders</h1>
                <Suspense fallback={<div/>}>
                    <NewOrderS storeID={id} />
                </Suspense>
            </div>
            <Suspense fallback={<OrdersSkeleton/>}>
                <Main storeID={id} />
            </Suspense>
        </div>
    )
}