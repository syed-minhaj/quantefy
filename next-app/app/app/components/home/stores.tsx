"use client"

import Image from "next/image"
import { store } from "@/app/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function Stores({stores}:{stores:store[]}) {

    const searchParams = useSearchParams();
    const currentSearchValue = searchParams.get('search') || '';

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {stores.filter((store : any) => store.name.toLowerCase().includes(currentSearchValue.toLowerCase()))
                .map((store : any) => (
                    <Link  href={`/app/store/${store.id}/dashboard`}
                        className="bg-bg2 border hover:border-black/20 dark:hover:border-white/40 rounded-r1 p-4 flex flex-col gap-4 h-40 " key={store.id}>
                        <div className="flex flex-row items-center gap-2">
                            {store.logo &&
                                <Image src={store.logo} alt="logo" width={32} height={32} className="rounded-r1 bg-bg2 h-8 w-8 object-contain border border-input" />
                            }
                            <h2 className="font-medium">{store.name}</h2>
                        </div>
                            
                        <p className="text-sm">{store.description}</p>
                    </Link>
                ))}
        </div>
    )
}