"use client"

import * as React from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function AdminNewsletterPage() {
  const [activeTab, setActiveTab] = React.useState<"subscribers" | "compose" | "whatsapp">("subscribers")
  const [subscribers, setSubscribers] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isSending, setIsSending] = React.useState(false)

  const [whatsappContacts, setWhatsappContacts] = React.useState<any[]>([])
  const [loadingContacts, setLoadingContacts] = React.useState(false)
  const [isBroadcasting, setIsBroadcasting] = React.useState(false)

  React.useEffect(() => {
    if (activeTab === "whatsapp" && whatsappContacts.length === 0) {
      setLoadingContacts(true)
      fetch("/api/admin/contacts")
        .then(res => res.json())
        .then(data => {
          setWhatsappContacts(data)
          setLoadingContacts(false)
        })
        .catch(err => {
          console.error("Error fetching contacts:", err)
          setLoadingContacts(false)
        })
    }
  }, [activeTab, whatsappContacts.length])

  React.useEffect(() => {
    fetch("/api/admin/newsletter")
      .then(res => res.json())
      .then(data => {
        setSubscribers(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching subscribers:", err)
        setLoading(false)
      })
  }, [])

  const handleSendDraft = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSending(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch("/api/admin/newsletter/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: formData.get("subject"),
          content: formData.get("content"),
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(data.message || "Newsletter sent successfully to sandbox!")
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error(data.error || "Failed to send newsletter.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    } finally {
      setIsSending(false)
    }
  }

  const handleBroadcast = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsBroadcasting(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      const res = await fetch("/api/admin/whatsapp/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: formData.get("message"),
          contacts: whatsappContacts,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        toast.success(`Broadcast complete! Sent: ${data.successCount}, Failed: ${data.failCount}`)
        ;(e.target as HTMLFormElement).reset()
      } else {
        toast.error(data.error || "Failed to broadcast message.")
      }
    } catch (error) {
      toast.error("An error occurred.")
    } finally {
      setIsBroadcasting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Newsletter Management</h1>
          <p className="text-sm text-slate-400">View subscribers or compose a new update.</p>
        </div>
        
        <div className="flex bg-slate-800/60 p-1 rounded-lg border border-slate-700/50">
          <button 
            type="button"
            onClick={() => setActiveTab("subscribers")}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "subscribers" ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}
          >
            All Active Emails
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("compose")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "compose" ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}
          >
            Compose News
          </button>
          <button 
            type="button"
            onClick={() => setActiveTab("whatsapp")}
            className={`px-6 py-2 text-sm font-medium rounded-md transition-all ${activeTab === "whatsapp" ? "bg-primary text-primary-foreground shadow-sm" : "text-slate-400 hover:text-white hover:bg-slate-700/50"}`}
          >
            WhatsApp Broadcast
          </button>
        </div>
      </div>

      {activeTab === "subscribers" && (
        <div className="animate-in fade-in duration-300">
          {loading ? (
            <p className="text-slate-400">Loading subscribers...</p>
          ) : (
            <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden">
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Date Subscribed</th>
                    <th className="px-6 py-4">Email</th>
                    <th className="px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                        No subscribers yet.
                      </td>
                    </tr>
                  ) : (
                    subscribers.map(item => (
                      <tr key={item.id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 font-medium">{item.email}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            {item.isActive ? "Active" : "Unsubscribed"}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {activeTab === "compose" && (
        <div className="animate-in fade-in duration-300">
          <div className="bg-slate-800/60 p-6 rounded-lg border border-slate-700/50 shadow-sm max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-2">Sandbox: Compose Newsletter</h2>
            <p className="text-sm text-slate-400 mb-6">
              Draft an update and simulate sending it to all your active subscribers. (Currently logs to console backend).
            </p>

            <form onSubmit={handleSendDraft} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Subject Line</label>
                <Input name="subject" required placeholder="e.g. Exciting New Floral Preservation Styles" className="bg-slate-900/50 border-slate-700 text-white" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Email Content (HTML)</label>
                <Textarea 
                  name="content" 
                  required 
                  placeholder="<p>Dear subscribers, we are thrilled to announce...</p>"
                  className="min-h-[250px] font-mono text-sm bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90" disabled={isSending}>
                {isSending ? "Sending..." : "Send Test Newsletter"}
              </Button>
            </form>
          </div>
        </div>
      )}

      {activeTab === "whatsapp" && (
        <div className="animate-in fade-in duration-300 space-y-6">
          <div className="bg-slate-800/60 p-6 rounded-lg border border-slate-700/50 shadow-sm max-w-3xl">
            <h2 className="text-xl font-bold text-white mb-2">WhatsApp Broadcast</h2>
            <p className="text-sm text-slate-400 mb-6">
              Send a bulk WhatsApp message to {whatsappContacts.length} contacts automatically extracted from orders and forms. Use {"{{name}}"} to replace with the customer's name.
            </p>

            <form onSubmit={handleBroadcast} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-300">Message Content</label>
                <Textarea 
                  name="message" 
                  required 
                  placeholder="Hello {{name}}, we have a special offer for you!"
                  className="min-h-[150px] font-mono text-sm bg-slate-900/50 border-slate-700 text-white"
                />
              </div>
              <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white" disabled={isBroadcasting || whatsappContacts.length === 0}>
                {isBroadcasting ? "Sending Broadcast..." : "Send WhatsApp Blast"}
              </Button>
            </form>
          </div>

          <div className="bg-slate-800/60 rounded-lg border border-slate-700/50 overflow-hidden mt-6">
            {loadingContacts ? (
              <p className="p-6 text-slate-400">Loading contacts...</p>
            ) : (
              <table className="w-full text-sm text-left text-slate-300">
                <thead className="bg-slate-900/50 text-slate-400 text-xs uppercase font-medium">
                  <tr>
                    <th className="px-6 py-4">Name</th>
                    <th className="px-6 py-4">Phone Number</th>
                    <th className="px-6 py-4">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-700/50">
                  {whatsappContacts.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="px-6 py-8 text-center text-slate-500">
                        No valid phone numbers found from orders or forms.
                      </td>
                    </tr>
                  ) : (
                    whatsappContacts.map((contact, idx) => (
                      <tr key={idx} className="hover:bg-muted/50">
                        <td className="px-6 py-4 font-medium">{contact.name || "N/A"}</td>
                        <td className="px-6 py-4 font-mono text-emerald-400">{contact.phone}</td>
                        <td className="px-6 py-4">
                          <span className="px-2 py-1 rounded-full text-xs bg-slate-700 text-slate-300 border border-slate-600">
                            {contact.source}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
