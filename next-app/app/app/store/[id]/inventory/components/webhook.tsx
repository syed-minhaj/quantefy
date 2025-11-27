import ClipboardBlock from "@/app/components/clipboardBlock";
import { X } from "lucide-react"
import { useEffect, useRef } from "react"

export default function Webhook({ setOpen , secret , storeID , itemID }:{setOpen:any , secret:string , storeID:string , itemID:string}) {

    const formRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
    
        const handleClickOutside = async (event:MouseEvent) => {
            if (!formRef.current?.contains(event.target  as Node) && event.target != document.getElementById("addItem")) {
                setOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);

        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [])

    const url = `https://quantefy.vercel.app/api/webhook/${storeID}/order/${itemID}`

    const apiExample = `{
    "secret": "${secret}",
    "quantity": 2,
    "price": 200,
    "cost": 120\n}`

    return (
        <div className={`z-200 fixed top-0 left-0 w-screen h-screen bg-black/50 dark:bg-gray-800/50 flex items-center justify-center z-100`}  >
            <div id={"webhookComponent"}
                className={` w-120 h-5/6 overflow-y-scroll rounded-r1 bg-bg1 relative p-4 flex flex-col gap-4 z-110`} ref={formRef} >
                <X className="m-4 absolute top-0 right-0 opacity-50 hover:opacity-100 " size={16} onClick={() => setOpen(!open)}/>
                <h2 className="font-medium ml-1 ">Webhook</h2>
                <div className="flex flex-col gap-4  text-normal  ">
                    <p className="opacity-85 px-1">Webhook api allows you to add orders to your store via api</p>
                    <div>
                        <p className="opacity-85 px-1">Url : </p>
                        <ClipboardBlock text={url} />
                    </div>
                    <div>
                        <p className="opacity-85 px-1">Store Webhook Secret : </p>
                        <ClipboardBlock text={secret} />
                    </div>
                    <div>
                        <p className="opacity-85 px-1">Api Body Example : </p>
                        <ClipboardBlock text={apiExample} />
                    </div>
                </div>
            </div>
        </div>
    )
}



