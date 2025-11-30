"use client"
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { useHash } from "@/app/hooks/hash"
import { X } from "lucide-react";
import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { item } from "@/app/type";
import { updateItem } from "@/app/actions/store";
import { toast } from "sonner";
import Webhook from "./webhook";

export default function ItemDetals({storeID , webhookSecret , items}:{storeID:string , webhookSecret:string , items:item[]}) {
    const {hash , updateHash} = useHash("")
    const [name, setName] = useState(items.find((item:any) => item.id == hash)?.name)
    const [price, setPrice] = useState(items.find((item:any) => item.id == hash)?.sale_price)
    const [cost, setCost] = useState(items.find((item:any) => item.id == hash)?.cost_price)
    const [quantity, setQuantity] = useState(items.find((item:any) => item.id == hash)?.quantity)
    const [picture, setPicture] = useState(items.find((item:any) => item.id == hash)?.picture)
    const [updating, setUpdating] = useState(false);
    const [open, setOpen] = useState(false);

    const componentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if(hash != "") {
            setName(items.find((item:any) => item.id == hash)?.name);
            setPrice(items.find((item:any) => item.id == hash)?.sale_price);
            setCost(items.find((item:any) => item.id == hash)?.cost_price);
            setQuantity(items.find((item:any) => item.id == hash)?.quantity);
            setPicture(items.find((item:any) => item.id == hash)?.picture);
        }

        if (hash != "" || open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';

        const webhookComponent = document.getElementById("webhookComponent");
        console.log(webhookComponent)
        const handleClickOutside = async (event:MouseEvent) => {
            if (!open && hash != "" && (!componentRef.current?.contains(event.target  as Node))) {
                console.log('Clicked outside the div!');
                updateHash("")
            }
            
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [hash , open])

    useEffect(()=>{
        // when open disable html and body scroll
        
    }, [open])

    function add(){
        if(!name || name == "" || price == null || cost == null || quantity == null || picture == null) {
            toast.error("All fields are required");
            return;
        };
        setUpdating(true);
        toast.loading("Updating item...",{
            id: "updateItem",
        });
        updateItem(name , price , cost , quantity  , storeID , hash).then((res) => {
            if(res.err) toast.error(res.err);
            else {
                toast.success("Item updated successfully");
                updateHash("");
            }
            toast.dismiss("updateItem");
            setUpdating(false);
        })
    }

    return (
        <>
        <div className={`overflow-x-hidden transform right-0 top-0  ${hash != "" ? "" : " translate-x-[120%]"} fixed
            transition-transform duration-300 ease-in-out z-200 h-screen w-screen sm:w-auto sm:p-4 `}>
            <div className={`flex flex-col gap-4 w-full sm:w-96 h-full rounded-r1 border border-input bg-bg2 relative  
            p-4 `} ref={componentRef}>
                <X onClick={() => updateHash("")} className="absolute right-0 top-0 m-4 opacity-50 hover:opacity-100 " size={16}/>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Name</span>
                    <Input type="text" value={name} onChange={(e) => {setName(e.target.value)}} className="w-fit disabled:opacity-50" disabled={updating}/>
                </div>
                {picture &&
                    <Image src={picture} alt="logo" width={120} height={120} className="rounded-r1 bg-bg1 h-30 w-30 object-contain border border-input" />
                }
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Price</span>
                    <Input type="number" value={price} onChange={(e) => {setPrice(Number(e.target.value))}} step={10} min={0} 
                     className="w-24 disabled:opacity-50" disabled={updating}/>
                    <span className="font-medium ml-4">Cost</span>
                    <Input type="number" value={cost} onChange={(e) => {setCost(Number(e.target.value))}} step={10} min={0} 
                     className="w-24 disabled:opacity-50" disabled={updating}/>
                </div>
                <div className="flex flex-row items-center gap-1">
                    <span className="font-medium">Qunatity</span>
                    <Input type="number" value={quantity} onChange={(e) => {setQuantity(Number(e.target.value))}} 
                     className="w-24 disabled:opacity-50" disabled={updating} min={0}/>
                </div>
                <div className="flex flex-row items-center gap-2">
                    <span className="font-medium">Webhook</span>
                    <Button className="flex-1" onClick={() => setOpen(true)} >
                        Link
                    </Button>
                </div>

                <Button className="mt-auto disabled:opacity-50" onClick={() => add()} disabled={updating}>
                    Save
                </Button>
            </div>
        </div>
        {open && <Webhook setOpen={setOpen} secret={webhookSecret} storeID={storeID} itemID={hash} />}
        </>
    )
}
