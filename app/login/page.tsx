import { AuthContainer } from "@/components/auth/auth-container"
import type { Metadata } from "next"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Sign In | Preserved Piece",
  description: "Sign in to your Preserved Piece account",
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-[#4a3f35]/50">Loading...</div>}>
      <AuthContainer initialView="login" />
    </Suspense>
  )
}
