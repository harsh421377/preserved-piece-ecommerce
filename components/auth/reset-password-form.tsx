"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react"

const schema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: { password: "", confirmPassword: "" },
  })

  async function onSubmit(values: z.infer<typeof schema>) {
    if (!token || !email) {
      setError("Missing token or email")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ ...values, token, email }),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) setSuccess(true)
      else {
        const data = await res.json()
        setError(data.error || "Failed to reset password")
      }
    } catch (err) {
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-[#4a3f35]/5 border border-[#a67c52]/20 text-[#4a3f35] placeholder-[#7d6b56]/60 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] focus:ring-1 focus:ring-[#a67c52]/20 transition-all text-sm"

  if (!token || !email) {
    return (
      <div className="text-center py-6 space-y-4">
        <AlertCircle className="w-12 h-12 text-red-600 mx-auto" />
        <h3 className="text-lg font-bold text-[#4a3f35]">Invalid Link</h3>
        <p className="text-[#4a3f35]/50 text-sm font-medium">This password reset link is invalid or has expired.</p>
        <button onClick={() => router.push("/forgot-password")} className="text-[#a67c52] hover:text-[#8d6e4c] text-sm font-bold pt-4 transition-colors">Request a new link</button>
      </div>
    )
  }

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto" />
        <h3 className="text-xl font-bold text-[#4a3f35]">Password Reset!</h3>
        <p className="text-[#4a3f35]/50 text-sm font-medium">Your password has been successfully updated.</p>
        <button onClick={() => router.push("/login")} className="bg-[#a67c52] hover:bg-[#8d6e4c] text-white px-8 py-3 rounded-xl font-bold mt-4 transition-all shadow-lg shadow-[#a67c52]/20">Sign In Now</button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">New Password</label>
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
        <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Confirm New Password</label>
        <div className="relative group">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
          <input {...register("confirmPassword")} type="password" placeholder="••••••••" className={`${inputCls} pl-10`} />
        </div>
        {errors.confirmPassword && <p className="text-[11px] text-red-600 ml-1 font-medium">{errors.confirmPassword.message}</p>}
      </div>

      {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"><AlertCircle className="w-4 h-4" />{error}</div>}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all flex items-center justify-center gap-2"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
      </button>
    </form>
  )
}
