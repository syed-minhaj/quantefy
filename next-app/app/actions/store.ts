"use server"
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { supabase } from "../lib/supabase";
import { db } from "../lib/drizzle";
import { item, store } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";


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