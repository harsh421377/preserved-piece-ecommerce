"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { signIn } from "next-auth/react"
import { Loader2, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react"

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function SignupForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get("callbackUrl") || "/"
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: { name: "", email: "", phone: "", password: "", confirmPassword: "" },
  })

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        setSuccess(true)
        // Auto sign-in
        await signIn("user-credentials", {
          email: values.email,
          password: values.password,
          callbackUrl: callbackUrl,
        })
      } else {
        const data = await res.json()
        setError(data.error || "Failed to create account")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-[#4a3f35]/5 border border-[#a67c52]/20 text-[#4a3f35] placeholder-[#7d6b56]/60 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] focus:ring-1 focus:ring-[#a67c52]/20 transition-all text-sm"

  if (success) {
    return (
      <div className="text-center py-8 space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
        <h3 className="text-xl font-bold text-[#4a3f35]">Account Created!</h3>
        <p className="text-[#4a3f35]/50">Redirecting you...</p>
        <Loader2 className="w-6 h-6 animate-spin text-[#a67c52] mx-auto mt-4" />
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Full Name</label>
        <div className="relative group">
          <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
          <input {...register("name")} placeholder="John Doe" className={`${inputCls} pl-10`} />
        </div>
        {errors.name && <p className="text-[11px] text-red-600 ml-1 font-medium">{errors.name.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Email Address</label>
        <div className="relative group">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
          <input {...register("email")} placeholder="name@example.com" className={`${inputCls} pl-10`} />
        </div>
        {errors.email && <p className="text-[11px] text-red-600 ml-1 font-medium">{errors.email.message}</p>}
      </div>

      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Phone (Optional)</label>
        <div className="relative group">
          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
          <input {...register("phone")} placeholder="+1 (555) 000-0000" className={`${inputCls} pl-10`} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Password</label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
            <input {...register("password")} type={showPassword ? "text" : "password"} placeholder="••••••••" className={`${inputCls} pl-10 pr-10`} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7d6b56]/60 hover:text-[#4a3f35]">
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          {errors.password && <p className="text-[11px] text-red-600 ml-1 font-medium">{errors.password.message}</p>}
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Confirm</label>
          <div className="relative group">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
            <input {...register("confirmPassword")} type="password" placeholder="••••••••" className={`${inputCls} pl-10`} />
          </div>
          {errors.confirmPassword && <p className="text-[11px] text-red-600 ml-1 font-medium">{errors.confirmPassword.message}</p>}
        </div>
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"><AlertCircle className="w-4 h-4" />{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all flex items-center justify-center gap-2 mt-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
      </button>

      <div className="relative py-4">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-[#a67c52]/10"></div></div>
        <div className="relative flex justify-center text-xs text-center"><span className="bg-transparent px-2 text-[#4a3f35]/30 uppercase tracking-[0.2em] font-bold">or continue with</span></div>
      </div>

      <button
        type="button"
        onClick={() => signIn("google", { callbackUrl })}
        className="w-full bg-white/60 hover:bg-white/80 text-[#4a3f35] font-bold py-3 rounded-xl border border-[#a67c52]/10 transition-all flex items-center justify-center gap-3 group shadow-sm animate-fade-in"
      >
        <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
          <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
          <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
          <path d="M5.84 14.1c-.22-.66-.35-1.36-.35-2.1s.13-1.44.35-2.1V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.84z" fill="#FBBC05"/>
          <path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
        </svg>
        Google
      </button>

      <p className="text-center text-sm text-[#4a3f35]/50 font-medium pt-2">
        Already have an account?{" "}
        <button type="button" onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)} className="text-[#a67c52] hover:text-[#8d6e4c] font-bold transition-colors">Sign in</button>
      </p>
    </form>
  )
}
