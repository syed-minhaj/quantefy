"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import {LayoutDashboard , ClipboardList ,Package , FileSpreadsheet   } from "lucide-react"
import { UserButton } from "@daveyplate/better-auth-ui"
 
const Pages = ["dashboard", "orders", "inventory", "report"]

const IconComponent = ({page}:{page : string}) => {
    if(page == "dashboard") return <LayoutDashboard size={20} className="font-medium"/>
    else if(page == "orders") return <ClipboardList size={20}/>
    else if(page == "inventory") return <Package size={20}/>
    else if(page == "report") return <FileSpreadsheet size={20}/>
    else return <div className="h-5 w-5"/>
}

export default function BottomBar({store}:{store:string}) {

    const pathname = usePathname()

    return (
        <div className="sm:hidden flex flex-row w-full h-16 bg-bg2 sticky bottom-0 justify-around items-center ">
            {Pages.map((page, index) => (
                <Link href={`/app/store/${store}/${page}`} key={index} 
                    className={`  rounded-[0.5rem] border flex flex-col items-center text-sm transition-all duration-300 ease-in-out
                    ${pathname.split(`/app/store/${store}/`).at(-1) == page ? "bg-bg1  border-black/20" : "border-transparent"} 
                    p-2 px-2 leading-none font-medium text-black/85 `} >
                    <IconComponent page={page} />
                    <span className={`  `}>
                        {page.charAt(0).toUpperCase() + page.slice(1)}
                    </span>
                </Link>
            ))}
            <UserButton className="z-80" size={"icon"}  /> 
        </div>
    );
}