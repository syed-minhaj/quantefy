import { Toaster } from "../../../components/ui/sonner";
import {Navbar} from "../../../components/Navbar";
import Providers from "../../../components/providers";
import SideBar from "../../../components/sideBar";
import BottomBar from "../../../components/bottomBar";

export default async function StoreLayout({
    children, params
}:  Readonly<{
    children: React.ReactNode; params:any
}>) {
    const { id } = await params ;
    console.log(id)
    return (
        <main lang="en" className="flex flex-row" >
            <Providers>
                <SideBar store={id} />
                <div className="flex flex-col flex-1">
                    <div className="h-[200vh]  ">
                        <Navbar />
                        {children}
                    </div>
                    <BottomBar store={id} />
                </div>
            </Providers>
            <Toaster position="top-center"/>
        </main>
    );
}