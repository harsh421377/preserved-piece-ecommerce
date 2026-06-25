"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Loader2, CheckCircle, Camera } from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(2, "Name too short"),
  phone: z.string().optional(),
  dob: z.string().optional(),
  gender: z.string().optional(),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export function ProfileForm({ profile }: { profile: any }) {
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      dob: profile?.dob ? new Date(profile.dob).toISOString().split('T')[0] : "",
      gender: profile?.gender || "",
      image: profile?.image || "",
    }
  })

  async function onSave(values: z.infer<typeof profileSchema>) {
    setSaveLoading(true)
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      body: JSON.stringify(values),
      headers: { "Content-Type": "application/json" },
    })
    if (res.ok) {
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    }
    setSaveLoading(false)
  }

  const inputCls = "w-full bg-background/50 border border-border/50 text-foreground rounded-xl px-4 py-3 outline-none focus:border-rose-400 focus:ring-1 focus:ring-rose-400 transition-all text-sm backdrop-blur-sm shadow-sm"
  const labelCls = "block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5 ml-1"

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl font-serif text-foreground mb-6">Personal Information</h2>
      
      <form onSubmit={handleSubmit(onSave)} className="space-y-6">
        <div className="flex items-center gap-6 mb-8">
          <div className="relative group">
            {profile?.image ? (
              <img src={profile.image} alt="" className="w-24 h-24 rounded-full object-cover ring-2 ring-rose-500/30" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-rose-500/20 to-purple-500/20 flex items-center justify-center text-foreground text-3xl font-bold ring-2 ring-rose-500/30">
                {(profile?.name?.[0] ?? profile?.email?.[0] ?? "?").toUpperCase()}
              </div>
            )}
            <button type="button" className="absolute bottom-0 right-0 bg-background border border-border rounded-full p-2 shadow-sm hover:scale-105 transition-transform">
              <Camera className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
          <div>
            <h3 className="font-medium text-foreground">Profile Picture</h3>
            <p className="text-sm text-muted-foreground">JPG, GIF or PNG. 1MB max.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
          <div>
            <label className={labelCls}>Full Name</label>
            <input {...register("name")} className={inputCls} placeholder="John Doe" />
            {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>}
          </div>
          <div>
            <label className={labelCls}>Email Address</label>
            <input value={profile?.email || ""} className={`${inputCls} opacity-60`} disabled />
          </div>
          <div>
            <label className={labelCls}>Phone Number</label>
            <input {...register("phone")} className={inputCls} placeholder="+1 (555) 000-0000" />
          </div>
          <div>
            <label className={labelCls}>Date of Birth</label>
            <input type="date" {...register("dob")} className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>Gender</label>
            <select {...register("gender")} className={inputCls}>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>
          <div>
            <label className={labelCls}>Avatar URL</label>
            <input {...register("image")} className={inputCls} placeholder="https://..." />
          </div>
        </div>

        <div className="flex items-center gap-4 pt-4">
          <button
            type="submit"
            disabled={saveLoading}
            className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/25"
          >
            {saveLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Changes"}
          </button>
          {saveSuccess && (
            <span className="flex items-center gap-2 text-green-500 text-sm font-medium animate-in fade-in slide-in-from-left-4">
              <CheckCircle className="w-4 h-4" /> Profile updated securely.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
