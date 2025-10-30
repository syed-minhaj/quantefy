import { Toaster } from "../components/ui/sonner";
import {Navbar} from "../components/Navbar";
import Providers from "../components/providers";
import SideBar from "../components/sideBar";


export default function AppLayout({
    children,
}:  Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <main lang="en" className="flex flex-row" >
            <Providers>
                <SideBar />
                <div className="min-h-screen flex-1 ">
                    <Navbar />
                    {children}
                </div>
            </Providers>
            <Toaster position="top-center"/>
        </main>
    );
}