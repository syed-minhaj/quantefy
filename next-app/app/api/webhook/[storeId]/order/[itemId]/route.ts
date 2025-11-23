
import { db } from "@/app/lib/drizzle";
import { item, order, store } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

async function createOrder(storeID:string , itemID:string , quantity:number  , 
        pricePerUnit:number , costPerUnit:number
) {
    if(quantity < 0) return {err : "Quantity cannot be negative"};
    if(pricePerUnit < 0) return {err : "Price cannot be negative"};
    if(costPerUnit < 0) return {err : "Cost cannot be negative"};
    
    const i = await db.select().from(item).where(eq(item.id , itemID));
    if(i[0].store_id != storeID) return {err : "item is not in this store"};
    if(i[0].quantity < quantity) return {err : "item quantity is not enough"};

    try{
        await db.insert(order).values({
            item_id : itemID,
            store_id: storeID,
            quantity,
            price_per_unit : pricePerUnit,
            cost_per_unit : costPerUnit,
            method: "api",
        }).returning({insertedID : order.id});

        await db.update(item).set({quantity : sql`${item.quantity} - ${quantity}`}).where(eq(item.id , itemID));
        
        
    }catch(e){
        console.log(e)
        return {err : "Failed to create store"}
    }
    return {err : null}
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ storeId: string; itemId: string; }> }
){
    try{
        const { storeId, itemId } = await params;
        const body = await req.json();
        const { secret, quantity, price, cost } = body;
    
        const store_secret = await db.select({
            secret : store.webhook_secret,
        }).from(store).where(eq(store.id , storeId));
    
        if(store_secret.length < 1 || store_secret[0].secret != secret) 
            return new NextResponse("Store secret is incorrect" , {status : 401});
    
        const {err} = await createOrder(storeId , itemId , quantity  , price , cost);
        if(err) return new NextResponse(`Failed to create order for item , ${err}` , {status : 401});
    
        return new Response(`order created for item ${itemId} in store ${storeId}`, {status : 200});
    }catch(e){
        console.log(e)
        return new Response("Failed to create order");
    }
}
