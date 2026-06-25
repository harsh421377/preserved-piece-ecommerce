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

      <p className="text-center text-sm text-[#4a3f35]/50 font-medium pt-2">
        Already have an account?{" "}
        <button type="button" onClick={() => router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)} className="text-[#a67c52] hover:text-[#8d6e4c] font-bold transition-colors">Sign in</button>
      </p>
    </form>
  )
}
