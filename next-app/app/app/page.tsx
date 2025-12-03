
import { store } from "@/db/schema";
import { Logo, Navbar } from "../components/Navbar"
import { db } from "../lib/drizzle";
import InputArea from "./components/home/inputArea"
import { headers } from "next/headers";
import { auth } from "../lib/auth";
import { eq } from "drizzle-orm";
import { Suspense } from "react";
import Stores from "./components/home/stores";

async function StoresSection() {
    const session = await auth.api.getSession({headers: await headers()});
    const stores = await db.select().from(store).where(eq(store.owner_id,session?.user.id ?? ""));
    return <Stores stores={stores}/>
}

function StoresSkeleton() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, index) => (
                    <div  className="bg-bg2 border rounded-r1 p-4 flex flex-col gap-4 h-40 animate-pulse " key={index}>
                        <div className="flex flex-row items-center gap-2">
                            <div className="rounded-r1 bg-gray-200 h-8 w-8 object-contain border border-input" />
                            <div className="font-medium bg-gray-200 h-6 flex-1 "/>
                        </div>
                        <div className="text-sm h-24 w-full bg-gray-200"/>
                    </div>
                ))}
        </div>
    )
}


export default async function Home() {

    return (
        <>
            <Navbar />
            <div className="flex flex-col w-11/12 mx-auto gap-6 ">
                <div className="fixed top-0 h-16 flex items-center">
                    <Logo/>
                </div>
                <Suspense fallback={<div/>}>
                    <InputArea />
                </Suspense>
                <h2 className="ml-1 font-semibold text-xl ">
                    Stores
                </h2>
                <Suspense fallback={<StoresSkeleton />}>
                    <StoresSection />
                </Suspense>
            </div>
        </>
    )
}