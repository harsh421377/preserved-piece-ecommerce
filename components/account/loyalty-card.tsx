"use client"

import { Gift, Sparkles, TrendingUp, Info } from "lucide-react"

export function LoyaltyCard({ points = 0 }: { points: number }) {
  const currentTier = points > 5000 ? "Platinum" : points > 2000 ? "Gold" : "Silver"
  const nextTier = currentTier === "Silver" ? { name: "Gold", points: 2000 } : currentTier === "Gold" ? { name: "Platinum", points: 5000 } : null
  
  const progress = nextTier ? Math.min(100, Math.max(0, (points / nextTier.points) * 100)) : 100

  return (
    <div className="max-w-xl">
      <h2 className="text-2xl font-serif text-foreground mb-8">Loyalty Program</h2>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-rose-900 via-purple-900 to-indigo-900 p-8 shadow-2xl mb-8 group">
        <div className="absolute top-0 left-0 w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col justify-between h-56">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-rose-200/80 text-sm font-bold uppercase tracking-widest mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Preserved Member
              </p>
              <h3 className="text-3xl font-serif text-white">{currentTier} Tier</h3>
            </div>
            <Gift className="w-12 h-12 text-rose-300 drop-shadow-lg opacity-80" />
          </div>
          
          <div>
            <p className="text-5xl font-light text-white font-mono tracking-tight">{points.toLocaleString()} <span className="text-xl text-rose-200/80 uppercase tracking-widest">PTS</span></p>
            <p className="text-rose-200/80 text-sm mt-3 font-medium tracking-wide">
              Earn 1 point for every ₹100 spent.
            </p>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-rose-500 rounded-full blur-3xl opacity-30 group-hover:opacity-40 transition-opacity" />
        <div className="absolute -top-10 -left-10 w-48 h-48 bg-purple-500 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity" />
      </div>

      {nextTier ? (
        <div className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm mb-8">
          <div className="flex justify-between items-center mb-3">
            <h4 className="font-bold text-foreground flex items-center gap-2"><TrendingUp className="w-4 h-4 text-purple-500" /> Progress to {nextTier.name}</h4>
            <span className="text-sm font-medium text-muted-foreground">{points.toLocaleString()} / {nextTier.points.toLocaleString()} PTS</span>
          </div>
          <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-purple-500 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-4 font-medium">
            Earn {(nextTier.points - points).toLocaleString()} more points to unlock {nextTier.name} tier benefits!
          </p>
        </div>
      ) : (
        <div className="bg-card border border-border/50 p-6 rounded-3xl shadow-sm mb-8">
          <h4 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-500 to-purple-500 flex items-center gap-2 mb-2">
            <Sparkles className="w-4 h-4 text-rose-500" /> Maximum Tier Reached!
          </h4>
          <p className="text-sm text-foreground font-medium">You are enjoying the absolute best perks we offer.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-rose-50 border border-rose-100 p-5 rounded-2xl">
          <h4 className="font-bold text-rose-900 mb-2">Redeem Points</h4>
          <p className="text-sm text-rose-700/80 font-medium">Use points at checkout for discounts. 100 PTS = ₹10</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 p-5 rounded-2xl">
          <h4 className="font-bold text-purple-900 mb-2">Exclusive Access</h4>
          <p className="text-sm text-purple-700/80 font-medium">Gold and Platinum members get early access to new collections.</p>
        </div>
      </div>

    </div>
  )
}
