"use client"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { useEffect, useState } from "react"
import CreateStore from "./createStore";

export default function InputArea() {

    const [open, setOpen] = useState(false);

    useEffect(()=>{
        if(open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [open])

    return (
        <div className="flex flex-row gap-2 w-full mt-16">
            <Input placeholder="Search" className="flex-1 bg-bg2 rounded-r1 "/>
            <Button className="rounded-r1" variant={"default"} onClick={() => setOpen(!open)}>
                Add Store
            </Button>
            <CreateStore open={open} setOpen={setOpen}/>
        </div>
    )
}