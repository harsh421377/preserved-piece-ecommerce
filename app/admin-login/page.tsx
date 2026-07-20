"use client"

import { useState, Suspense } from "react"
import { signIn } from "next-auth/react"
import { useRouter, useSearchParams } from "next/navigation"
import { Loader2, Eye, EyeOff, Diamond } from "lucide-react"

const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000

function AdminLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallback = searchParams.get("callbackUrl") ?? "/admin"
  // Always keep admin login within /admin — never redirect to main site
  const callbackUrl = rawCallback.startsWith("/admin") ? rawCallback : "/admin"

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [attempts, setAttempts] = useState(0)
  const [lockedUntil, setLockedUntil] = useState<number | null>(null)

  const isLocked = lockedUntil ? Date.now() < lockedUntil : false
  const remaining = lockedUntil ? Math.ceil((lockedUntil - Date.now()) / 60000) : 0

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (isLocked) return
    setLoading(true)
    setError("")

    const result = await signIn("admin-credentials", { email, password, redirect: false })

    if (result && !result.error) {
      router.push(callbackUrl)
      router.refresh()
    } else {
      const newAttempts = attempts + 1
      setAttempts(newAttempts)
      if (newAttempts >= MAX_ATTEMPTS) {
        setLockedUntil(Date.now() + LOCKOUT_MS)
        setError("Too many failed attempts. Account locked for 15 minutes.")
      } else {
        setError(`Invalid credentials. ${MAX_ATTEMPTS - newAttempts} attempt(s) remaining.`)
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 overflow-hidden" style={{ background: "linear-gradient(135deg, #0f0c1a 0%, #1a1030 50%, #0d1526 100%)" }}>
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="pp-orb" style={{ width: 500, height: 500, top: "-15%", left: "-10%", background: "radial-gradient(circle, #7c3aed33, transparent 70%)" }} />
        <div className="pp-orb" style={{ width: 400, height: 400, bottom: "-10%", right: "-5%", background: "radial-gradient(circle, #b45309, transparent 70%)" }} />
        {/* Grid lines */}
        <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(180,110,0,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(180,110,0,0.04) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 pp-login-icon" style={{ background: "linear-gradient(135deg, #7c3aed, #b45309)", boxShadow: "0 0 40px #7c3aed55" }}>
            <Diamond className="h-9 w-9 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-wide" style={{ fontFamily: "serif" }}>Preserved Piece</h1>
          <p className="text-sm mt-1" style={{ color: "#b45309" }}>Admin Portal — Authorized Access Only</p>
        </div>

        {/* Card */}
        <div style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(24px)", border: "1px solid rgba(180,83,9,0.2)", borderRadius: 20, padding: "2rem", boxShadow: "0 25px 60px rgba(0,0,0,0.5)" }}>
          {isLocked ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: "rgba(239,68,68,0.15)" }}>
                <span className="text-2xl">🔒</span>
              </div>
              <p className="font-semibold" style={{ color: "#f87171" }}>Account Temporarily Locked</p>
              <p className="text-sm mt-2" style={{ color: "#94a3b8" }}>Retry in {remaining} minute(s)</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.3)", color: "#f87171", fontSize: 14, padding: "12px 16px", borderRadius: 10 }}>
                  {error}
                </div>
              )}

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 6 }}>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="username"
                  placeholder="preservedpiece@gmail.com"
                  style={{ width: "100%", padding: "10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(180,83,9,0.25)", borderRadius: 10, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                  onFocus={e => e.target.style.borderColor = "#7c3aed"}
                  onBlur={e => e.target.style.borderColor = "rgba(180,83,9,0.25)"}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "#cbd5e1", marginBottom: 6 }}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="••••••••"
                    style={{ width: "100%", padding: "10px 40px 10px 14px", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(180,83,9,0.25)", borderRadius: 10, color: "white", fontSize: 14, outline: "none", boxSizing: "border-box" }}
                    onFocus={e => e.target.style.borderColor = "#7c3aed"}
                    onBlur={e => e.target.style.borderColor = "rgba(180,83,9,0.25)"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#64748b", cursor: "pointer" }}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ width: "100%", padding: "12px", background: "linear-gradient(135deg, #7c3aed, #b45309)", color: "white", fontWeight: 600, fontSize: 15, borderRadius: 10, border: "none", cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
              >
                {loading ? <><Loader2 size={16} className="animate-spin" /> Authenticating...</> : <><Diamond size={16} /> Sign In to Admin</>}
              </button>
            </form>
          )}
          <p style={{ fontSize: 11, color: "#475569", textAlign: "center", marginTop: 20 }}>
            Protected by rate limiting, session security & account lockout
          </p>
        </div>
      </div>

      <style>{`
        .pp-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
        @keyframes float { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        .pp-login-icon { animation: float 4s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin h-8 w-8 text-purple-500" /></div>}>
      <AdminLoginForm />
    </Suspense>
  )
}
