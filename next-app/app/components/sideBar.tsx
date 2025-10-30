"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {LayoutDashboard , ClipboardList ,Package , FileSpreadsheet , MoveLeft  } from "lucide-react"
 
const Pages = ["dashboard", "orders", "inventory", "report"]


const IconComponent = ({page}:{page : string}) => {
    if(page == "dashboard") return <LayoutDashboard size={20} className="font-medium"/>
    else if(page == "orders") return <ClipboardList size={20}/>
    else if(page == "inventory") return <Package size={20}/>
    else if(page == "report") return <FileSpreadsheet size={20}/>
    else return <div className="h-5 w-5"/>
}

export default function SideBar() {

    const [open, setOpen] = useState(true);
    const pathname = usePathname()
    

    return (
        <div className={`${open ? "w-60" : "w-17.5"} relative h-screen bg-sidebar flex flex-col  transition-all duration-500 ease-in-out sideBar-parent  `}>
            <div className="h-16 flex flex-row pt-4 pl-6">
                <h1 className={`font-bold ${open ? "w-32" : "w-0"} overflow-hidden transition-all duration-500 ease-in-out logo `}>Quantefy</h1>
                <MoveLeft className={` absolute right-5.75 p-1 text-black/85 border border-black/20 rounded  ${open ? "" : "rotate-180 "} `} 
                onClick={() => setOpen(!open)} />
            </div>
            <div className="px-4 flex flex-col gap-1 flex-1 group sideBar-child ">
                {Pages.map((page, index) => (
                    <Link href={`/app/${page}`} key={index} 
                        className={` ${open ? "w-52 " : "w-9.5"} rounded-[0.5rem] border flex flex-row items-center  transition-all duration-500 ease-in-out group-hover:w-52
                        ${pathname.split("/app/").at(-1) == page ? "bg-prePrimary  border-black/20" : "border-transparent"} 
                        p-2 px-2 leading-none font-medium text-black/85 `} >
                        <IconComponent page={page} />
                        <span className={`${open ? "w-24" : "w-0 "} overflow-hidden whitespace-nowrap  transition-all duration-500 ease-in-out group-hover:w-24 `}>
                            &nbsp;{'  ' + page.charAt(0).toUpperCase() + page.slice(1)}
                        </span>
                    </Link>
                ))}
            </div>
        </div>
    )
}