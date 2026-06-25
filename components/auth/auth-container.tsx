"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { AuthScene3D } from "@/components/3d/auth-scene"
import { LoginForm } from "./login-form"
import { SignupForm } from "./signup-form"

interface AuthContainerProps {
  initialView?: "login" | "signup"
}

export function AuthContainer({ initialView = "login" }: AuthContainerProps) {
  const [view, setView] = useState<"login" | "signup">(initialView)

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-8">
      <AuthScene3D />

      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
        className="relative z-10 w-full max-w-[440px]"
      >
        <div className="relative group">
          {/* Glowing border effect */}
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#a67c52]/20 via-[#d4c8aa]/20 to-[#a67c52]/20 rounded-[2.5rem] blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200" />
          
          <div className="relative rounded-[2rem] overflow-hidden backdrop-blur-3xl bg-white/60 border border-[#a67c52]/10 shadow-[0_32px_80px_rgba(74,63,53,0.15)]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#a67c52]/20 to-transparent" />
            
            <div className="px-8 py-10 sm:px-10">
              <div className="mb-10 text-center">
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="inline-block"
                >
                  <span className="font-serif text-3xl font-semibold tracking-wider bg-gradient-to-br from-[#4a3f35] via-[#a67c52] to-[#4a3f35]/60 bg-clip-text text-transparent">
                    𝒫𝓇𝑒𝓈𝑒𝓇𝓋𝑒𝒹 𝒫𝒾𝑒𝒸𝑒
                  </span>
                  <div className="h-px w-12 bg-[#a67c52]/50 mx-auto mt-2 rounded-full" />
                </motion.div>
                <h2 className="mt-4 text-xs font-bold text-[#4a3f35]/60 uppercase tracking-[0.2em]">
                  {view === "login" ? "Welcome Back" : "Start Your Journey"}
                </h2>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={view}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {view === "login" ? (
                    <LoginForm />
                  ) : (
                    <SignupForm />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-transparent via-[#a67c52]/10 to-transparent" />
          </div>
        </div>
      </motion.div>

      {/* Background glass artifacts */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-[#a67c52]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-64 h-64 bg-[#d4c8aa]/10 rounded-full blur-[120px] pointer-events-none" />
    </div>
  )
}
