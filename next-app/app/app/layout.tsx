import { Toaster } from "../components/ui/sonner";
import Providers from "../components/providers";

export default async function StoreLayout({
    children
}:  Readonly<{
    children: React.ReactNode; 
}>) {

    return (
        <main lang="en" className="relative min-h-screen" >
            <Providers>
                {children}
            </Providers>
            <Toaster position="top-center"/>
        </main>
    );
}