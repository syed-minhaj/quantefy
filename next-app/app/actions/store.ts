"use server"
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { supabase } from "../lib/supabase";
import { db } from "../lib/drizzle";
import { item, order, store,notificationRecipient } from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { OrderMethod } from "../type";
import { user } from "@/db/auth-schema";


const supabaseUrl = process.env.SUPABASE_URL + "/storage/v1/object/public";

export const createStore = async (name:string , description:string , logo:File | null) => {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) return {err : "Sign in to create store"};
    if(name == "") return {err : "Name is required"};
    
    try{
    
        const storeID = await db.insert(store).values({
            name,
            description,
            owner_id: session.user.id,
        }).returning({insertedID : store.id});
    
        if(!logo) return {err : null};

        const {data , error} = await supabase.storage
            .from("quantefy")
            .upload(`store/${storeID[0].insertedID}/logo.png` , logo ,{
                                cacheControl: '3600', 
                                contentType: 'image/png', 
                                upsert: false, 
                            });
    
        if(error) console.log(error)
        if(!error) await db.update(store).set({logo: `${supabaseUrl}/quantefy/store/${storeID[0].insertedID}/logo.png`})
                    .where(eq(store.id , storeID[0].insertedID));
            
        revalidatePath("/app");
        
    }catch(e){
        console.log(e)
        return {err : "Failed to create store"}
    }
    return {err : null}

}

export const addItem = async (name:string , price:number , cost:number , quantity:number , picture:File , storeID:string) => {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) return {err : "Sign in to create store"};
    if(name == "") return {err : "Name is required"};
    
    try{
    
        const itemID = await db.insert(item).values({
            name,
            sale_price : price,
            cost_price : cost,
            quantity,
            store_id : storeID,
            picture : "",
        }).returning({insertedID : item.id});
    
        const {data , error} = await supabase.storage
            .from("quantefy")
            .upload(`item/${itemID[0].insertedID}/picture.png` , picture ,{
                                cacheControl: '3600', 
                                contentType: 'image/png', 
                                upsert: false, 
                            });

        if(error) console.log(error)
        if(!error) await db.update(item).set({picture: `${supabaseUrl}/quantefy/item/${itemID[0].insertedID}/picture.png`})
                    .where(eq(item.id , itemID[0].insertedID));
            
        revalidatePath(`/app/store/${storeID}/inventory`);
        
    }catch(e){
        console.log(e)
        return {err : "Failed to create store"}
    }
    return {err : null}

}

export async function updateItem(name:string , price:number , cost:number , quantity:number , storeID:string , itemID:string) {
    
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) return {err : "Sign in to create store"};
    if(name == "") return {err : "Name is required"};
    if(price < 0) return {err : "Price cannot be negative"};
    if(cost < 0) return {err : "Cost cannot be negative"};
    if(quantity < 0) return {err : "Quantity cannot be negative"};
    
    const s = await db.select().from(store).where(eq(store.id , storeID));
    if(s[0].owner_id != session.user.id) return {err : "You are not the owner of this store"};
    const i = await db.select().from(item).where(eq(item.id , itemID));
    if(i[0].store_id != storeID) return {err : "item is not in this store"};

    try{
        await db.update(item)
                    .set({
                        name,
                        sale_price : price,
                        cost_price : cost,
                        quantity,
                    })
                    .where(eq(item.id , itemID));
            
        revalidatePath(`/app/store/${storeID}/inventory`);
        
    }catch(e){
        console.log(e)
        return {err : "Failed to create store"}
    }
    return {err : null}

}

export async function createOrder(storeID:string , itemID:string , quantity:number , method: OrderMethod , 
        pricePerUnit:number , costPerUnit:number
) {
    const session = await auth.api.getSession({headers: await headers()});
    if (!session) return {err : "Sign in First"};
    if(quantity < 0) return {err : "Quantity cannot be negative"};
    if(pricePerUnit < 0) return {err : "Price cannot be negative"};
    if(costPerUnit < 0) return {err : "Cost cannot be negative"};
    
    const s = await db.select().from(store).where(eq(store.id , storeID));
    if(s[0].owner_id != session.user.id) return {err : "You are not the owner of this store"};
    const i = await db.select().from(item).where(eq(item.id , itemID));
    if(i[0].store_id != storeID) return {err : "item is not in this store"};

    try{
        await db.insert(order).values({
            item_id : itemID,
            store_id: storeID,
            quantity,
            price_per_unit : pricePerUnit,
            cost_per_unit : costPerUnit,
            method,
        }).returning({insertedID : order.id});

        await db.update(item).set({quantity : sql`${item.quantity} - ${quantity}`}).where(eq(item.id , itemID));
            
        revalidatePath(`/app/store/${storeID}/orders`);

        const subscribers = await db.select().from(notificationRecipient).where(eq(notificationRecipient.store_id,storeID));
        const subscription = await db.select({deviceSubscriptions : user.deviceSubscriptions}).from(user).where(eq(user.id,subscribers[0].user_id));
        fetch(`${process.env.BETTER_AUTH_URL}/api/send-notification` , {
            method : "POST",
            headers : {
                "Content-Type" : "application/json",
            },
            body : JSON.stringify({
                subscribers : subscription[0].deviceSubscriptions,
                title : "New Order",
                body : `New order has been placed for ${quantity} items worth ${pricePerUnit * quantity} `
            })
        })
        
    }catch(e){
        console.log(e)
        return {err : "Failed to create store"}
    }
    return {err : null}
}