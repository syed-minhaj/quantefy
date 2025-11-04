"use client"
import Image from "next/image";
import { useHash } from "@/app/hooks/hash"
import { item } from "@/app/type";

export default function Item({item}:{item:item}) {

    const {updateHash} = useHash("")

    return (
        <div className="flex flex-col gap-1 bg-bg2 rounded-r1 border border-input w-full sm:w-64 p-2 hover:border-black/20 " 
        key={item.id} onClick={() => updateHash(item.id)} >
            <Image src={item.picture} alt="logo" width={256} height={192} className="rounded-r1 bg-bg1 h-48 w-full object-contain border border-input" />
            
            <h3 >{item.name}</h3>
            <div className="flex flex-row gap-2">
                Price : 
                <p className="font-medium">{item.sale_price}</p>
            </div>
            <div className="flex flex-row gap-2">
                Quantity : 
                <p className="font-medium">{item.quantity}</p>
            </div>
        </div>
    )
}
