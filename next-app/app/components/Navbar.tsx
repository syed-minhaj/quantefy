"use client"
import {UserButton} from "@daveyplate/better-auth-ui"
// import Logo from "./navbar/logo";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";

const ThemeSwitcher = dynamic(() => import("./navbar/ThemeSwitch"), { ssr: false });

export const Logo = () => {
    return (
        <span className="text-xl font-bold tracking-tight text-foreground">Quantefy</span>
    )
}

export const LandingPageNavbar = () => {
    const [isVisible, setIsVisible] = useState(true);
    
    useEffect(() => {
        let lastScrollY = window.scrollY;
        
        const handleScroll = () => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 80) {
                setIsVisible(false);
            } else {
                setIsVisible(true);
            }
            
            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const navClasses = `
        fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 
        bg-card/90 backdrop-blur-sm border-b border-border/50 shadow-sm
        transition-transform duration-300 ease-in-out
        ${isVisible ? 'translate-y-0' : '-translate-y-full'}
    `;

    return (
        <nav className={navClasses}>
            <div className="max-w-7xl mx-auto flex justify-between items-center">
                <Logo/>
                <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
                    <a href="#features" className="hover:text-primary transition">Features</a>
                    <a href="#api" className="hover:text-primary transition">API & Webhooks</a>
                    <a href="https://github.com/syed-minhaj/quantefy" target="_blank" className="hover:text-primary transition">Docs</a>
                </div>
                <a 
                    href="/app" 
                    target="_blank" 
                    className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:bg-primary/90 transition shadow-lg shadow-primary/20"
                >
                    Start Now
                </a>
            </div>
        </nav>
    );
};

export   function Navbar() {


    return (
        <nav className="flex flex-row items-center justify-center h-16 px-4 absolute top-0 right-0 ">
            <div className="ml-auto gap-4 flex flex-row">
                <ThemeSwitcher/>
                <UserButton className="z-80" size={"icon"}  /> 
            </div>
        </nav>
    )
    
} 


export  function HomeNavbar() {

    
    return (
        <nav className="flex flex-row items-center justify-center h-16 px-4">
            <div className="ml-auto gap-4 flex flex-row">
                <Link className="" href='/app/fields' >
                    <Button variant={"link"}>Try Now</Button>
                </Link>
                <ThemeSwitcher/>
            </div>
        </nav>
    )
}