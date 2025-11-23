import { Suspense } from "react";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { item, store } from "@/db/schema";
import { db } from "@/app/lib/drizzle";
import { eq } from "drizzle-orm";
import AddItem from "./components/additems";
import Item from "./components/item";
import ItemDetals from "./components/itemDetals";


async function Main({storeID}:{storeID:string}) {

    const session = await auth.api.getSession({headers: await headers()});
    if (!session) redirect("/app/auth/sign-In");
    const stores = await db.select().from(store).where(eq(store.id,storeID));
    if (!stores.length) redirect("/app/store");
    if (stores[0].owner_id != session.user.id) redirect("/app/store");
    const items = await db.select().from(item).where(eq(item.store_id,storeID));

    return (
        <div className="flex flex-row">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1  ">
                {items.map((item) => (
                    <Item item={item} />
                ))}
            </div>
            <ItemDetals storeID={storeID} webhookSecret={stores[0].webhook_secret} items={items} />
        </div>
    )
}


function InventorySkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array(12).fill(0).map((_, index) => (
                    <div  className="flex flex-col gap-1 bg-bg2 rounded-r1 border border-input w-full sm:w-64 p-2 animate-pulse " key={index}>
                        <div className="rounded-r1 h-48 w-full object-contain border border-input bg-gray-200 " />
                        <div className=" bg-gray-200 h-6 w-full "/>
                        <div className=" bg-gray-200 h-6 w-2/5 "/>
                        <div className=" bg-gray-200 h-6 w-3/5 "/>
                    </div>
                ))}
        </div>
    )
}

export default async function Inventory({params}:{params:any}) {
    const { id } = await params;
    return (
        <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden">
            <div className="flex flex-col  gap-4">
                <h1 className="text-xl font-semibold">Inventory</h1>
                <AddItem storeID={id} />
            </div>
            <Suspense fallback={<InventorySkeleton/>}>
                <Main storeID={id} />
            </Suspense>
        </div>
    )
}