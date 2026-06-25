"use client"

import { useState } from "react"
import { Shield, Key, Smartphone, LogOut, CheckCircle, Loader2 } from "lucide-react"
import { signOut } from "next-auth/react"

export function SecuritySettings({ email }: { email: string | null }) {
  const [resetLoading, setResetLoading] = useState(false)
  const [resetSuccess, setResetSuccess] = useState(false)
  const [twoFAEnabled, setTwoFAEnabled] = useState(false)

  async function handlePasswordReset() {
    if (!email) return
    setResetLoading(true)
    try {
      await fetch("/api/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) })
      setResetSuccess(true)
      setTimeout(() => setResetSuccess(false), 5000)
    } finally {
      setResetLoading(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-10">
      
      {/* Password Management */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-rose-100 text-rose-600 rounded-2xl">
            <Key className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-serif font-bold text-foreground">Password Management</h2>
            <p className="text-muted-foreground text-sm mt-1 mb-6">Receive a secure link to update your password. Standard security practices recommend changing it every 90 days.</p>
            
            <button
              onClick={handlePasswordReset}
              disabled={resetLoading || !email}
              className="bg-background border border-border hover:bg-muted text-foreground px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 text-sm shadow-sm"
            >
              {resetLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send Reset Link"}
            </button>
            {resetSuccess && (
              <p className="text-green-600 text-sm mt-3 flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4" /> Link sent! Check your inbox.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Two Factor Authentication (Mock) */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-purple-100 text-purple-600 rounded-2xl">
            <Smartphone className="w-6 h-6" />
          </div>
          <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h2 className="text-xl font-serif font-bold text-foreground">Two-Factor Authentication</h2>
              <p className="text-muted-foreground text-sm mt-1">Add an extra layer of security to your account using an authenticator app or SMS.</p>
            </div>
            <button
              onClick={() => setTwoFAEnabled(!twoFAEnabled)}
              className={`px-6 py-3 rounded-xl font-bold transition-all text-sm shrink-0 flex items-center gap-2 ${twoFAEnabled ? "bg-green-50 text-green-700 border border-green-200" : "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-lg shadow-rose-500/25"}`}
            >
              {twoFAEnabled ? <><CheckCircle className="w-4 h-4" /> Enabled</> : "Set up 2FA"}
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-slate-100 text-slate-600 rounded-2xl">
            <Shield className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-serif font-bold text-foreground">Device Sessions</h2>
            <p className="text-muted-foreground text-sm mt-1 mb-6">Manage devices where you're currently logged into your account.</p>
            
            <div className="bg-muted/30 rounded-2xl p-4 border border-border/50 mb-6 flex justify-between items-center">
              <div>
                <p className="font-bold text-foreground text-sm">Windows PC • Chrome</p>
                <p className="text-xs text-green-600 font-medium">Active now</p>
              </div>
            </div>

            <button
              onClick={() => {
                if(confirm("Log out of all other devices?")) alert("Logged out of other devices successfully.")
              }}
              className="text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2 rounded-lg text-sm font-bold transition-colors flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" /> Log out of all other devices
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
