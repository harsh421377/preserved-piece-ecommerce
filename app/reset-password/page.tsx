import { Suspense } from "react"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import { AuthScene3D } from "@/components/3d/auth-scene"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | Preserved Piece",
}

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-8">
      <AuthScene3D />
      <div className="relative z-10 w-full max-w-md">
        <div className="relative rounded-3xl overflow-hidden backdrop-blur-2xl bg-white/60 border border-[#a67c52]/10 shadow-[0_32px_80px_rgba(74,63,53,0.15)] px-8 py-10 sm:px-10">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a67c52]/20 to-transparent" />
          <div className="mb-8 text-center">
            <span className="font-serif text-2xl font-semibold tracking-wide bg-gradient-to-br from-[#4a3f35] via-[#a67c52] to-[#4a3f35]/60 bg-clip-text text-transparent">𝒫𝓇𝑒𝓈𝑒𝓇𝓋𝑒𝒹 𝒫𝒾𝑒𝒸𝑒</span>
          </div>
          <Suspense fallback={<div className="text-[#4a3f35]/50 text-center">Loading…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
