"use client"

import { useState } from "react"
import { Bell, Mail, MessageSquare, Loader2, CheckCircle } from "lucide-react"

export function PreferencesForm() {
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  const [prefs, setPrefs] = useState({
    emailOrder: true,
    emailPromo: false,
    smsOrder: true,
    smsPromo: false,
  })


  const handleSave = () => {
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }, 1000)
  }

  return (
    <div className="space-y-12">
      
      {/* Notifications */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-rose-100 text-rose-600 rounded-xl"><Bell className="w-5 h-5" /></div>
          <h2 className="text-2xl font-serif text-foreground">Notification Preferences</h2>
        </div>
        
        <div className="bg-card border border-border/50 rounded-3xl p-6 md:p-8 shadow-sm space-y-8">
          
          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" /> Email Notifications</h3>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-bold text-foreground">Order Updates</p>
                <p className="text-sm text-muted-foreground">Confirmation, shipping tracking, and delivery.</p>
              </div>
              <input type="checkbox" checked={prefs.emailOrder} onChange={e => setPrefs({...prefs, emailOrder: e.target.checked})} className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-600" />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-bold text-foreground">Exclusive Offers & News</p>
                <p className="text-sm text-muted-foreground">Promotions, new arrivals, and gifting events.</p>
              </div>
              <input type="checkbox" checked={prefs.emailPromo} onChange={e => setPrefs({...prefs, emailPromo: e.target.checked})} className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-600" />
            </label>
          </div>

          <div className="w-full h-px bg-border/50" />

          <div className="space-y-6">
            <h3 className="text-lg font-bold flex items-center gap-2"><MessageSquare className="w-4 h-4 text-muted-foreground" /> SMS & WhatsApp</h3>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-bold text-foreground">Order & Tracking SMS</p>
                <p className="text-sm text-muted-foreground">Get real-time delivery status on your phone.</p>
              </div>
              <input type="checkbox" checked={prefs.smsOrder} onChange={e => setPrefs({...prefs, smsOrder: e.target.checked})} className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-600" />
            </label>
            
            <label className="flex items-center justify-between cursor-pointer group">
              <div>
                <p className="font-bold text-foreground">Secret Sale Alerts</p>
                <p className="text-sm text-muted-foreground">SMS-only flash sales.</p>
              </div>
              <input type="checkbox" checked={prefs.smsPromo} onChange={e => setPrefs({...prefs, smsPromo: e.target.checked})} className="w-5 h-5 rounded border-rose-300 text-rose-600 focus:ring-rose-600" />
            </label>
          </div>

          <div className="flex items-center gap-4 pt-4">
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 disabled:opacity-50 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/25"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Save Preferences"}
            </button>
            {saved && (
              <span className="flex items-center gap-2 text-green-500 text-sm font-medium animate-in fade-in">
                <CheckCircle className="w-4 h-4" /> Saved!
              </span>
            )}
          </div>
        </div>
      </section>



    </div>
  )
}
