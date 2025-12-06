import { auth } from "@/app/lib/auth";
import NotificationsSettings from "./components/NotificationsSettings";
import { headers } from "next/headers";
import { db } from "@/app/lib/drizzle";
import { user } from "@/db/auth-schema";
import {notificationRecipient} from "@/db/schema";
import { and, eq } from "drizzle-orm";

export default async function Settings({params}:{params:any}) {
    const { id } = await params;

    const session = await auth.api.getSession({headers: await headers()});

    if(!session?.user.id) return <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden">
        
    </div>

    const u = session.user

    const notified = await db.select().from(notificationRecipient).where(and(eq(notificationRecipient.store_id,id),eq(notificationRecipient.user_id,u.id)));

    console.log(notified)

    return (
        <div className="flex flex-col gap-4 w-full px-4 overflow-x-hidden">
            <div className="flex flex-row items-center ">
                <h1 className="text-xl font-semibold">Settings</h1>
            </div>
            <div className="flex flex-col gap-2">
                <h3 className="font-medium text-lg ">PWA - Progressive Web App</h3>
                <NotificationsSettings notified={notified.length > 0 ? true : false} user={u} storeID={id} />
            </div>
        </div>
    )
}