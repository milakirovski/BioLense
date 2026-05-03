'use client'

import { usePathname } from 'next/navigation'
import { Providers } from "./providers"
import { Navbar } from "@/components/layout/navbar"
import { Box } from "@chakra-ui/react"

export default function RootLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === '/login'

    return (
        <html lang="en" suppressHydrationWarning>
        <body>
        <Providers>
            {!isLoginPage && <Navbar />}
            <Box as="main" p="8" bg={isLoginPage ? "white" : "gray.50"} minHeight="100vh">
                {children}
            </Box>
        </Providers>
        </body>
        </html>
    )
}