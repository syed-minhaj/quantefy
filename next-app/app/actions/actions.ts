"use server"
import { revalidatePath } from "next/cache";
import { db } from "../lib/drizzle";
import { notificationRecipient } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { user } from "@/db/auth-schema";

export async function createNotificationRecipient(storeID:string,userID:string) {
    try{
        await db.insert(notificationRecipient).values({
            store_id : storeID,
            user_id : userID,
        })
    }catch(e){
        console.log(e)
    }
    revalidatePath(`/app/store/${storeID}/settings`);
}


export async function deleteNotificationRecipient(storeID:string,userID:string) {
    try{
        await db.delete(notificationRecipient).where(and(eq(notificationRecipient.store_id,storeID),eq(notificationRecipient.user_id,userID)));
    }catch(e){
        console.log(e)
    }
    revalidatePath(`/app/store/${storeID}/settings`);
}


export async function subscribe(subscription:string , userID:string) {
    
    try{
        const subs = await db.select({deviceSubscriptions : user.deviceSubscriptions}).from(user).where(eq(user.id,userID));
        if(subs[0].deviceSubscriptions?.includes(subscription)) return;
        await db.update(user).set({deviceSubscriptions: sql`array_append(${user.deviceSubscriptions},${subscription})`})
    }catch(e){
        console.log(e)
    }  
}