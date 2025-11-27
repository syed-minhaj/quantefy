"use client"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { useEffect, useRef, useState } from "react"
import { X } from "lucide-react";
import { Textarea } from "@/app/components/ui/textarea";
import { createStore } from "@/app/actions/store";
import { toast } from "sonner";

export default function CreateStore({open , setOpen}:{open :Boolean , setOpen:React.Dispatch<React.SetStateAction<boolean>>}) {

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [logo, setLogo] = useState<File | null>(null);
    const [creating, setCreating] = useState(false);
    const formRef = useRef<HTMLDivElement>(null);

    function create() {
        if (name == "") {toast.error("Name is required"); return;}
        setCreating(true);
        createStore(name , description , logo).then((res) => {
            if (res.err) toast.error(res.err);
            else {
                toast.success("Store created successfully");
                setOpen(false);
                setName("");
                setDescription("");
                setLogo(null);
            }
            setCreating(false);
        })
    }

    useEffect(() => {
    
        const handleClickOutside = async (event:MouseEvent) => {
            if (!formRef.current?.contains(event.target  as Node) && event.target != document.getElementById("addStore")) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])


    return(
        <div className={`${open ? "fixed" : "hidden"} top-0 left-0 w-screen h-screen bg-black/50 dark:bg-gray-800/50 flex items-center justify-center z-100`}  >
            <div className={` w-120 h-5/6 rounded-r1 bg-bg1 relative p-4 flex flex-col gap-4 z-110`} ref={formRef} >
                <X className="m-4 absolute top-0 right-0 opacity-50 hover:opacity-100 " size={16} onClick={() => setOpen(!open)}/>
                <h2 className="font-medium ml-1 ">Add Store</h2>
                <div className="flex flex-col gap-1  text-normal">
                    <Input placeholder="Name" type="text" className="bg-bg2 rounded-r1 disabled:opacity-50 " disabled={creating} required
                        onChange={(e) => setName(e.target.value)}/>
                    <Textarea placeholder="Description" className="bg-bg2 rounded-r1 h-36 resize-none disabled:opacity-50" disabled={creating}
                        onChange={(e) => setDescription(e.target.value)}/>
                    <span className={`ml-1 text-sm font-medium ${creating ? "opacity-50" : ""}`} >Logo</span>
                    <Input placeholder="Logo" type="file" disabled={creating} 
                        onChange={(e) => {e.target.files ? setLogo(e.target.files[0]) : null}} className="bg-bg2 rounded-r1 disabled:opacity-50 "/>
                    {logo &&
                        <img src={logo ? URL.createObjectURL(logo) : ""}  alt="logo" className="rounded-r1 bg-bg2 h-24 w-24 object-contain border border-input "/>
                    }
                </div>
                <Button className="rounded-r1 mt-auto ml-auto disabled:opacity-50" variant={"default"} disabled={creating}
                    onClick={() => create()}>Add Store</Button>
            </div>
        </div>
    )
}