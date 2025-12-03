'use client'
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { useEffect, useState, useCallback } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import CreateStore from "./createStore";

export default function InputArea() {

    const [open, setOpen] = useState(false);
    const [search , setSearch] = useState("");

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams(); 

    useEffect(()=>{
        if(open) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }, [open])

    const handleSearchChange = useCallback((event: { target: { value: any } }) => {
        const value = event.target.value;
        setSearch(value);
        const currentParams = new URLSearchParams(searchParams.toString());

        if (value) {
            currentParams.set('search', value);
        } else {
            // Delete parameter if input is empty
            currentParams.delete('search');
        }
        router.replace(`${pathname}?${currentParams.toString()}`);
    }, [router, pathname, searchParams]);


    const currentSearchValue = searchParams.get('search') || '';
    
    useEffect(() => {
        setSearch(currentSearchValue);
    }, [currentSearchValue]);

    return (
        <div className="flex flex-row gap-2 w-full mt-16" >
            <Input placeholder="Search" className="flex-1 bg-bg2 rounded-r1" 
                onChange={handleSearchChange} value={search} />
            <Button className="rounded-r1" variant={"default"} onClick={() => setOpen(!open)} id="addStore">
                Add Store
            </Button>
            <CreateStore open={open} setOpen={setOpen}/>
        </div>
    )
}
