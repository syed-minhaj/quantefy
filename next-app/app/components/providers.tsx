"use client"

import { AuthUIProvider } from "@daveyplate/better-auth-ui"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { authClient } from "../lib/auth-client"
import { ThemeProvider as NextThemeProvider } from "next-themes"

export default function Providers({ children }: { children: ReactNode }) {
    const router = useRouter()
    const pathname = usePathname()
    
    return (
         <NextThemeProvider 
            attribute="class" 
            defaultTheme="system" 
            enableSystem
            disableTransitionOnChange>
                <AuthUIProvider
                    basePath="/app/auth"
                    authClient={authClient}
                    navigate={router.push}
                    replace={router.replace}
                    redirectTo="/"
                    onSessionChange={() => {
                        router.refresh()
                    }}
                    Link={Link}
                    social={{providers : ["google"]}}
                    credentials={{
                        passwordValidation: {
                            minLength: 8,
                        },
                        confirmPassword: true,
                    }}
                >
                    {children}
                </AuthUIProvider>
        </NextThemeProvider>
    )
}