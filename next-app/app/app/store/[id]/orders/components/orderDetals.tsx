"use client"
import { useHash } from "@/app/hooks/hash"
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { order , item } from "@/app/type";

type orderType = order & {item:item}

export default function OrderDetals({storeID , orders}:{storeID:string , orders:orderType[]}) {
    const {hash , updateHash} = useHash("")
    const [name, setName] = useState(orders.find((order:orderType) => order.id == hash)?.item.name)
    const [price, setPrice] = useState(orders.find((order:orderType) => order.id == hash)?.price_per_unit)
    const [cost, setCost] = useState(orders.find((order:orderType) => order.id == hash)?.cost_per_unit)
    const [quantity, setQuantity] = useState(orders.find((order:orderType) => order.id == hash)?.quantity)
    const [picture, setPicture] = useState(orders.find((order:orderType) => order.id == hash)?.item.picture)
    const [orderDate, setOrderDate] = useState(orders.find((order:orderType) => order.id == hash)?.created_at)
    const [method, setMethod] = useState(orders.find((order:orderType) => order.id == hash)?.method)
    
    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(hash != "") {
            setName(orders.find((order:orderType) => order.id == hash)?.item.name);
            setPrice(orders.find((order:orderType) => order.id == hash)?.price_per_unit);
            setCost(orders.find((order:orderType) => order.id == hash)?.cost_per_unit);
            setQuantity(orders.find((order:orderType) => order.id == hash)?.quantity);
            setPicture(orders.find((order:orderType) => order.id == hash)?.item.picture);
            setOrderDate(orders.find((order:orderType) => order.id == hash)?.created_at);
            setMethod(orders.find((order:orderType) => order.id == hash)?.method);
        }

        const handleClickOutside = async (event:MouseEvent) => {
            if (hash != "" && !componentRef.current?.contains(event.target  as Node)) {
                console.log('Clicked outside the div!');
                updateHash("")
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [hash])


    return (
        <div className={`overflow-x-hidden transform right-0 top-0  ${hash != "" ? "" : " translate-x-[120%]"} fixed
            transition-transform duration-300 ease-in-out z-200 h-screen w-screen sm:w-auto p-4 `}>
            <div className={`flex flex-col gap-4 w-full sm:w-96 h-full rounded-r1 border border-input bg-bg2 relative  
            p-4 `} ref={componentRef}>
                <X onClick={() => updateHash("")} className="absolute right-0 top-0 m-4 opacity-50 hover:opacity-100 " size={16}/>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Name</span>
                    {name}
                </div>
                {picture &&
                    <Image src={picture} alt="logo" width={120} height={120} className="rounded-r1 bg-bg1 h-30 w-30 object-contain border border-input" />
                }
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Price</span>
                    {price}
                    <span className="font-medium ml-4">Cost</span>
                    {cost}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Qunatity</span>
                    {quantity}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Total</span>
                    {(price && quantity) && price * quantity}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Order Date</span>
                    {orderDate?.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Order Method</span>
                    {method}
                </div>
            </div>
        </div>
    )
}
