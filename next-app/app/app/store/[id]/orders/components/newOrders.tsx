"use client"
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Select ,SelectTrigger, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue } from "@/app/components/ui/select";
import { item } from "@/app/type";
import { X } from "lucide-react";
import Image from "next/image";
import {useEffect, useRef, useState} from "react";
import { toast } from "sonner";
import { createOrder as createOrderApi } from "@/app/actions/store";

export default function NewOrder({items,storeID}:{items:item[],storeID:string}) {
    const [open, setOpen] = useState(false);
    const [adding, setAdding] = useState(false);
    const [item, setItem] = useState<item>();
    const [quantity, setQuantity] = useState(1);
    const [pricePerUnit, setPricePerUnit] = useState<number>();
    const [costPerUnit, setCostPerUnit] = useState<number>();
    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = async (event:MouseEvent) => {
            if (!formRef.current?.contains(event.target  as Node) && event.target != document.getElementById("newOrder") 
                && document.getElementById("select")?.contains(event.target  as Node)) {
                setOpen(false);
                console.log(formRef.current?.contains(event.target  as Node), event.target);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    useEffect(()=>{
        if(open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [open])

    useEffect(() => {
        if(!item) return;
        setPricePerUnit(item.sale_price)
        setCostPerUnit(item.cost_price)
    }, [item])

    function createOrder() {
        if(!item) {toast.error("Select Item"); return;}
        if(!quantity) {toast.error("Select Quantity"); return}
        if(!pricePerUnit) {toast.error("Select Price per unit");return}
        if(!costPerUnit) {toast.error("Select Cost per unit");return}
        if(quantity < 0) {toast.error("Quantity cannot be negative");return}
        if(quantity > item.quantity) {toast.error("Not enough item in stock");return}
        if(!pricePerUnit || pricePerUnit < 0) {toast.error("Price must be positive");return}
        if(!costPerUnit || costPerUnit < 0) {toast.error("Cost must be positive");return}
        setAdding(true);
        toast.loading("Creating Order" , {
            id : "creatingOrder"
        });
        createOrderApi(storeID , item.id , quantity , "manual" , pricePerUnit , costPerUnit).then((res) => {
            if(res.err) toast.error(res.err);
            else {
                toast.dismiss("creatingOrder");
                toast.success("Order Created");
                setAdding(false);
                setOpen(false);
                setItem(undefined);
                setQuantity(1);
                setPricePerUnit(undefined);
                setCostPerUnit(undefined);
            }
        })
    }

    function Item({item}:{item:item}) {
        return (
            <div className="w-full flex flex-row gap-2">
                <Image src={item.picture} alt="logo" width={256} height={192} className="rounded-r1 bg-bg1 h-16 w-16 object-contain border border-input" />
                <div className="flex flex-col gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm">{item.created_at.getMonth()}</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <Button className="rounded-r1 ml-auto" variant={"default"} onClick={() => setOpen(!open)} id="newOrder">
                New
            </Button>
            <div className={`${open ? "fixed" : "hidden"} top-0 left-0 w-screen h-screen bg-black/50 dark:bg-gray-800/50 flex items-center justify-center z-100`}  >
                <div className={` w-120 h-5/6 rounded-r1 bg-bg1 relative p-4 flex flex-col gap-4 z-110`} ref={formRef} >
                    <X className="m-4 absolute top-0 right-0 opacity-50 hover:opacity-100 " size={16} onClick={() => setOpen(!open)}/>
                    <h2 className="font-medium ml-1 ">New Order</h2>
                    <div className="flex flex-col gap-4  text-normal">
                        <Select onValueChange={(v) => setItem(items.find(i => i.id == v))}>
                            <SelectTrigger className="w-full min-h-20 p-3" disabled={adding} >
                                {item ?
                                    <Item item={item}/>
                                :<SelectValue placeholder="Select Item" />}
                            </SelectTrigger>
                            <SelectContent className="z-200" id="select">
                                <SelectGroup>
                                    <SelectLabel>Select Item</SelectLabel>
                                    {items.map((item) => (
                                        <SelectItem value={item.id} key={item.id}>
                                            <Item item={item}/>
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="font-medium text-sm whitespace-nowrap">Quantity :</span>
                            <Input className="w-full disabled:opacity-50" placeholder="Quantity" type="number" min={1} value={quantity} 
                            onChange={(e) => setQuantity(Number(e.target.value))} disabled={adding} />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="font-medium text-sm whitespace-nowrap">Price per unit :</span>
                            <Input className="w-full disabled:opacity-50" placeholder="price" type="number" min={0} value={pricePerUnit} 
                            onChange={(e) => setPricePerUnit(Number(e.target.value))} disabled={adding} />
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <span className="font-medium text-sm whitespace-nowrap">Cost per unit :</span>
                            <Input className="w-full disabled:opacity-50" placeholder="cost" type="number" min={0}  value={costPerUnit} 
                            onChange={(e) => setCostPerUnit(Number(e.target.value))} disabled={adding} />
                        </div>
                    </div>
                    <Button className="rounded-r1 mt-auto ml-auto disabled:opacity-50" disabled={adding}
                        onClick={() => createOrder()}>Done</Button>
                </div>
            </div>
        </>
    )
}