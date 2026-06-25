"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Loader2, UserRound, MapPin, ShieldCheck, Heart, Package, CreditCard, Sparkles, LogOut, Settings2, BellRing, ArrowLeft } from "lucide-react"

// Components
import { ProfileForm } from "@/components/account/profile-form"
import { AddressBook } from "@/components/account/address-book"
import { SecuritySettings } from "@/components/account/security-settings"
import { WishlistGrid } from "@/components/account/wishlist-grid"
import { OrderList } from "@/components/account/order-list"
import { LoyaltyCard } from "@/components/account/loyalty-card"
import { PreferencesForm } from "@/components/account/preferences-form"

export default function AccountPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("profile")
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileSubSectionOpen, setMobileSubSectionOpen] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login")
    // Admin sessions should never access the customer account page
    if (status === "authenticated" && session?.user?.role === "admin") router.replace("/admin")
  }, [status, session, router])

  useEffect(() => {
    if (status !== "authenticated") return
    fetch("/api/user/profile").then(r => r.json()).then(data => {
      setProfile(data)
      setLoading(false)
    })
  }, [status])

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-rose-500" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading dashboard...</p>
      </div>
    )
  }

  const navItems = [
    { id: "profile", label: "My Profile", icon: UserRound, section: "Account" },
    { id: "address", label: "Address Book", icon: MapPin, section: "Account" },
    { id: "security", label: "Security & Login", icon: ShieldCheck, section: "Account" },
    
    { id: "orders", label: "My Orders", icon: Package, section: "Shopping" },
    { id: "wishlist", label: "Saved Items", icon: Heart, section: "Shopping" },
    { id: "loyalty", label: "Loyalty Points", icon: Sparkles, section: "Shopping" },
    { id: "preferences", label: "Notifications", icon: Settings2, section: "Settings" },
  ]

  const groupedNav = navItems.reduce((acc, item) => {
    if (!acc[item.section]) acc[item.section] = []
    acc[item.section].push(item)
    return acc
  }, {} as Record<string, typeof navItems>)

  return (
    <div className="min-h-screen bg-background pb-20 pt-24">
      {/* Premium Header Profile Summary */}
      <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 ${mobileSubSectionOpen ? "hidden lg:block" : "block"}`}>
        <div className="bg-gradient-to-r from-rose-600/10 via-purple-600/10 to-transparent p-6 sm:p-8 rounded-3xl border border-rose-600/10 flex flex-col sm:flex-row items-center sm:justify-between gap-6 backdrop-blur-md">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-500 to-purple-600 p-1">
              {profile?.image ? (
                <img src={profile.image} alt="" className="w-full h-full rounded-full object-cover border-4 border-background" />
              ) : (
                <div className="w-full h-full rounded-full bg-background flex flex-col items-center justify-center font-serif text-2xl text-foreground">
                  {(profile?.name?.[0] ?? profile?.email?.[0] ?? "?").toUpperCase()}
                </div>
              )}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-serif text-foreground mb-1">{profile?.name ?? "Welcome Back!"}</h1>
              <p className="text-muted-foreground text-sm font-medium">{profile?.email}</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:items-end w-full sm:w-auto mt-4 sm:mt-0 gap-3">
             <div className="flex flex-col sm:items-end">
                <span className="text-xs uppercase tracking-widest font-bold text-muted-foreground">Reward Balance</span>
                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-purple-500">{profile?.loyaltyPoints?.toLocaleString() ?? 0} PTS</span>
             </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Left Navigation Sidebar */}
          <aside className={`w-full lg:w-72 shrink-0 ${mobileSubSectionOpen ? "hidden lg:block" : "block"}`}>
            <div className="sticky top-24 bg-card/50 border border-border/50 rounded-3xl p-6 shadow-sm">
              <nav className="space-y-6">
                {Object.entries(groupedNav).map(([section, items]) => (
                  <div key={section}>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 mb-3 ml-4">{section}</p>
                    <ul className="space-y-1">
                      {items.map(item => (
                        <li key={item.id}>
                          <button
                            onClick={() => {
                              setActiveTab(item.id)
                              setMobileSubSectionOpen(true)
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all text-sm font-medium ${
                              activeTab === item.id 
                                ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-500/20" 
                                : "text-muted-foreground hover:bg-muted"
                            }`}
                          >
                            <item.icon className="w-4 h-4 shrink-0" />
                            {item.label}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="pt-6 border-t border-border/50 mt-6">
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })} 
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                  >
                    <LogOut className="w-4 h-4 shrink-0" /> Sign Out
                  </button>
                </div>
              </nav>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className={`flex-1 min-w-0 ${mobileSubSectionOpen ? "block" : "hidden lg:block"}`}>
            {/* Back Button for mobile detail view */}
            {mobileSubSectionOpen && (
              <button
                onClick={() => setMobileSubSectionOpen(false)}
                className="flex items-center gap-2 mb-6 px-4 py-2.5 rounded-2xl bg-secondary text-sm font-semibold text-foreground hover:bg-secondary/80 transition-colors lg:hidden"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Account
              </button>
            )}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.98, filter: "blur(4px)" }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className="bg-card/30 rounded-3xl min-h-[500px]"
              >
                {activeTab === "profile" && <ProfileForm profile={profile} />}
                {activeTab === "address" && <AddressBook />}
                {activeTab === "security" && <SecuritySettings email={profile?.email} />}
                
                {activeTab === "orders" && <OrderList />}
                {activeTab === "wishlist" && <WishlistGrid />}
                {activeTab === "loyalty" && <LoyaltyCard points={profile?.loyaltyPoints ?? 0} />}
                
                {activeTab === "preferences" && <PreferencesForm />}
              </motion.div>
            </AnimatePresence>
          </main>

        </div>
      </div>
    </div>
  )
}
