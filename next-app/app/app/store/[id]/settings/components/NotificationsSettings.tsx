"use client"

import { createNotificationRecipient, deleteNotificationRecipient, subscribe } from "@/app/actions/actions";
import { Button } from "@/app/components/ui/button";
import {user} from "@/app/type"
import { toast } from "sonner";

type paramsType = {
    notified:boolean,
    user:user,
    storeID:string
}

async function notificationPermission(userID:string) {
    const permission = await Notification.requestPermission();
    if (permission === "granted") { console.log("Notification permission granted");  };
    const sw = await navigator.serviceWorker.ready;

    const subscription = await sw.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
    });

    await subscribe(JSON.stringify(subscription),userID);
}


export default function NotificationsSettings({notified,user,storeID}:paramsType) {

    function Notify() {
        toast("Allow Notifications", {
            description: "Allow notifications for every new order",
            duration: 5000,
            action: {
                label: "Allow",
                onClick: async () => {
                    notificationPermission(user.id)
                    createNotificationRecipient(storeID,user.id)
                    toast.dismiss()
                },
            },
        })
    }
    function DeNotify() {
        toast("Diable Notifications", {
            description: "Disable notifications for this store",
            duration: 5000,
            action: {
                label: "Disable",
                onClick: async () => {
                    deleteNotificationRecipient(storeID,user.id)
                    toast.dismiss()
                },
            },
        })
    }

    return (
        <div className="grid grid-cols-5 md:grid-cols-12 border-2 border-border p-2 px-4 rounded-r1">
            <div className="col-span-4 md:col-span-11">
                <h4 className="font-medium ">Notifications</h4>
                <p className="">Allow notifications for every new order</p>
            </div>
            {notified ?
                <Button onClick={DeNotify} variant={"outline"} className="h-full">Allowed</Button>
            :
                <Button onClick={Notify} className="h-full">Allow</Button>
            }
        </div>
    )
}