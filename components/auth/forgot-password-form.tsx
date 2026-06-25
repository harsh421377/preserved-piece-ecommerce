"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Loader2, Mail, Lock, Eye, EyeOff, AlertCircle, CheckCircle2, ArrowLeft, KeyRound } from "lucide-react"

export function ForgotPasswordForm() {
  const router = useRouter()
  const [step, setStep] = useState(1) // 1: Email, 2: OTP, 3: New Password
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Form Fields
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Send OTP
  async function handleSendOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        setStep(2)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to send OTP.")
      }
    } catch (err) {
      setError("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Verify OTP
  async function handleVerifyOtp(e: React.FormEvent) {
    e.preventDefault()
    if (!otp || otp.length !== 6 || isNaN(Number(otp))) {
      setError("Please enter a valid 6-digit OTP.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/forgot-password/verify", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        setStep(3)
      } else {
        const data = await res.json()
        setError(data.error || "Invalid or expired OTP.")
      }
    } catch (err) {
      setError("Failed to verify OTP. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  // Reset Password
  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.")
      return
    }
    setLoading(true)
    setError("")
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        body: JSON.stringify({ email, token: otp, password }),
        headers: { "Content-Type": "application/json" },
      })
      if (res.ok) {
        setSuccess(true)
      } else {
        const data = await res.json()
        setError(data.error || "Failed to reset password.")
      }
    } catch (err) {
      setError("Failed to reset password. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-[#4a3f35]/5 border border-[#a67c52]/20 text-[#4a3f35] placeholder-[#7d6b56]/60 rounded-xl px-4 py-3 outline-none focus:border-[#a67c52] focus:ring-1 focus:ring-[#a67c52]/20 transition-all text-sm"

  if (success) {
    return (
      <div className="text-center py-6 space-y-4">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto border border-green-100">
          <CheckCircle2 className="w-10 h-10 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-[#4a3f35]">Password Reset!</h3>
        <p className="text-[#4a3f35]/50 text-sm font-medium">Your password has been successfully updated.</p>
        <button onClick={() => router.push("/login")} className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all text-sm mt-4">Sign In Now</button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Step 1: Send OTP */}
      {step === 1 && (
        <form onSubmit={handleSendOtp} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"><AlertCircle className="w-4 h-4" />{error}</div>}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all flex items-center justify-center gap-2 text-sm"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Sand OTP on mail"}
            </button>
            <button type="button" onClick={() => router.push("/login")} className="w-full text-[#4a3f35]/40 hover:text-[#4a3f35]/60 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to sign in
            </button>
          </div>
        </form>
      )}

      {/* Step 2: Verify OTP */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/30 transition-colors" />
              <input
                type="email"
                disabled
                value={email}
                className={`${inputCls} pl-10 opacity-60 bg-[#4a3f35]/5`}
              />
            </div>
          </div>

          {/* Original button showing it was sent */}
          <button
            type="button"
            disabled
            className="w-full bg-[#4a3f35]/10 text-[#4a3f35]/40 font-bold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 text-sm cursor-not-allowed"
          >
            OTP Sent to Mail
          </button>

          {/* "new option available below sand otp on mail to verify otp" */}
          <form onSubmit={handleVerifyOtp} className="space-y-6 pt-2 border-t border-[#a67c52]/10">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-[#a67c52] ml-1 uppercase tracking-widest">Enter 6-Digit OTP</label>
              <div className="relative group">
                <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  className={`${inputCls} pl-10 tracking-[0.25em] font-mono text-center`}
                />
              </div>
            </div>

            {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"><AlertCircle className="w-4 h-4" />{error}</div>}

            <div className="space-y-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all flex items-center justify-center gap-2 text-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify OTP"}
              </button>
              <button type="button" onClick={() => setStep(1)} className="w-full text-[#4a3f35]/40 hover:text-[#4a3f35]/60 text-sm font-bold flex items-center justify-center gap-2 transition-colors">
                <ArrowLeft className="w-4 h-4" /> Change email address
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Step 3: Change Password */}
      {step === 3 && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} pl-10 pr-10`}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7d6b56]/60 hover:text-[#4a3f35]">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#4a3f35]/60 ml-1 uppercase tracking-widest">Confirm New Password</label>
            <div className="relative group">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7d6b56]/60 group-focus-within:text-[#a67c52] transition-colors" />
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`${inputCls} pl-10`}
              />
            </div>
          </div>

          {error && <div className="p-3 bg-red-50 border border-red-100 rounded-xl flex items-center gap-2 text-red-600 text-xs font-medium"><AlertCircle className="w-4 h-4" />{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#a67c52] hover:bg-[#8d6e4c] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-[#a67c52]/20 transition-all flex items-center justify-center gap-2 text-sm"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Reset Password"}
          </button>
        </form>
      )}
    </div>
  )
}
