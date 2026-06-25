"use client"

import { usePathname } from "next/navigation"
import { SessionProvider } from "next-auth/react"
import { CartProvider } from "@/lib/cart-context"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import type { ReactNode } from "react"

export function ClientLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith("/admin")
  const isAuthPage = ["/login", "/signup", "/forgot-password", "/reset-password"].some(p => pathname?.startsWith(p))

  if (isAdmin) {
    return <SessionProvider>{children}</SessionProvider>
  }

  if (isAuthPage) {
    return <SessionProvider>{children}</SessionProvider>
  }

  return (
    <SessionProvider>
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
      </CartProvider>
    </SessionProvider>
  )
}
