"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, Mail, Lock, Eye, EyeOff, KeyRound, AlertCircle, ArrowRight } from "lucide-react"

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

const otpSchema = z.object({
  email: z.string().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be 6 digits"),
})

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  
  const [mode, setMode] = useState<"password" | "otp">("password")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const pwdForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  })

  const otpForm = useForm<z.infer<typeof otpSchema>>({
    resolver: zodResolver(otpSchema),
    defaultValues: { email: "", otp: "" },
  })

  async function onPasswordSubmit(values: z.infer<typeof loginSchema>) {
    setLoading(true)
    setError("")
    try {
      const res = await signIn("user-credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      })
      if (res?.error) setError("Invalid email or password")
      else router.push(callbackUrl)
    } finally {
      setLoading(false)
    }
  }

  async function sendOtp() {
    const email = otpForm.getValues("email")
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email first")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) setOtpSent(true)
      else setError("Failed to send code")
    } finally {
      setLoading(false)
    }
  }

  async function onOtpSubmit(values: z.infer<typeof otpSchema>) {
    setLoading(true)
    setError("")
    try {
      const res = await signIn("otp", {
        email: values.email,
        otp: values.otp,
        redirect: false,
      })
      if (res?.error) setError("Invalid or expired code")
      else router.push(callbackUrl)
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-[#4a3f35]/5 border border-[#a67c52]/20 text-[#4a3f35] placeholder-[#7d6b56]/60 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] focus:ring-1 focus:ring-[#a67c52]/20 transition-all text-sm"

  return (
    <div className="space-y-6">
      <div className="flex p-1 bg-[#4a3f35]/5 rounded-xl border border-[#a67c52]/10">
        <button
          onClick={() => { setMode("password"); setError(""); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === "password" ? "bg-white/60 text-[#4a3f35] shadow-sm" : "text-[#4a3f35]/40 hover:text-[#4a3f35]/70"}`}
        >
          Email & Password
        </button>
        <button
          onClick={() => { setMode("otp"); setError(""); }}
          className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${mode === "otp" ? "bg-white/60 text-[#4a3f35] shadow-sm" : "text-[#4a3f35]/40 hover:text-[#4a3f35]/70"}`}
        >
          One-Time Code
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={mode}
          initial={{ opacity: 0, x: mode === "password" ? -10 : 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: mode === "password" ? 10 : -10 }}
          transition={{ duration: 0.2 }}
        >
          {mode === "password" ? (
            <form onSubmit={pwdForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Email</label>
                <div className="relative group">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
                  <input {...pwdForm.register("email")} placeholder="name@example.com" className={`${inputCls} pl-10`} />
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex justify-between items-center px-1">
                  <label className="text-xs font-bold text-[#4a3f35]/60 uppercase tracking-widest">Password</label>
                  <button type="button" onClick={() => router.push("/forgot-password")} className="text-xs font-semibold text-[#a67c52] hover:text-[#8d6e4c] transition-colors">Forgot?</button>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
                  <input {...pwdForm.register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pl-10 pr-10`} />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7d6b56]/60 hover:text-[#4a3f35] transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"><AlertCircle className="w-4 h-4" />{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Sign In <ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          ) : (
            <form onSubmit={otpForm.handleSubmit(onOtpSubmit)} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Email Address</label>
                <div className="relative group flex gap-2">
                  <div className="relative flex-1">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
                    <input {...otpForm.register("email")} placeholder="name@example.com" className={`${inputCls} pl-10`} />
                  </div>
                  {!otpSent && (
                    <button
                      type="button"
                      onClick={sendOtp}
                      disabled={loading}
                      className="px-4 bg-[#a67c52]/10 hover:bg-[#a67c52]/20 text-[#a67c52] text-xs font-bold rounded-xl border border-[#a67c52]/20 transition-all whitespace-nowrap disabled:opacity-50"
                    >
                      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Send Code"}
                    </button>
                  )}
                </div>
              </div>

              {otpSent && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-1.5">
                  <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Verification Code</label>
                  <div className="relative group">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
                    <input {...otpForm.register("otp")} placeholder="000000" maxLength={6} className={`${inputCls} pl-10 tracking-[0.5em] font-mono font-bold`} />
                  </div>
                  <button type="button" onClick={sendOtp} className="text-[11px] font-medium text-[#4a3f35]/40 hover:text-[#4a3f35]/70 ml-1 transition-colors">Didn't get it? Send again</button>
                </motion.div>
              )}
              
              {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"><AlertCircle className="w-4 h-4" />{error}</div>}
              
              <button
                type="submit"
                disabled={loading || !otpSent}
                className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all flex items-center justify-center gap-2"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
              </button>
            </form>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#a67c52]/10"></div></div>
        <div className="relative flex justify-center text-xs text-center"><span className="bg-transparent px-2 text-[#4a3f35]/30 uppercase tracking-[0.2em] font-bold">or continue with</span></div>
      </div>

      <button
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full bg-white/60 hover:bg-white/80 text-[#4a3f35] font-bold py-3 rounded-xl border border-[#a67c52]/10 transition-all flex items-center justify-center gap-3 group shadow-sm"
      >
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p className="text-center text-sm text-[#4a3f35]/50 font-medium">
        Don't have an account?{" "}
        <button onClick={() => router.push(`/signup?callbackUrl=${encodeURIComponent(callbackUrl)}`)} className="text-[#a67c52] hover:text-[#8d6e4c] font-bold transition-colors">Sign up</button>
      </p>
    </div>
  )
}
