"use client"

import { useEffect, useState } from "react"
import { Mail, Phone, Eye, CheckCircle2 } from "lucide-react"

interface Message {
  id: string; name: string; email: string; phone?: string
  subject: string; message: string; read: boolean; createdAt: string
}

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  useEffect(() => {
    fetch("/api/admin/messages")
      .then(r => r.json())
      .then(d => { setMessages(d.messages ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const toggleReadStatus = async (id: string, currentStatus: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      // Optimistic update
      setMessages(prev => prev.map(m => m.id === id ? { ...m, read: !currentStatus } : m));
      
      await fetch(`/api/admin/messages/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !currentStatus })
      });
    } catch (error) {
      console.error("Failed to update status");
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-slate-400 text-sm">{messages.filter(m => !m.read).length} unread messages</p>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="p-12 text-center">
            <Mail className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No messages yet</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {messages.map((m) => (
              <div key={m.id} className={`p-5 ${!m.read ? "bg-rose-500/5 border-l-2 border-rose-500" : ""}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-white font-medium text-sm">{m.name}</p>
                      {!m.read && <span className="text-xs px-2 py-0.5 bg-rose-500/20 text-rose-400 rounded-full">New</span>}
                    </div>
                    <div className="flex items-center gap-4 mt-1 flex-wrap">
                      <a href={`mailto:${m.email}`} className="flex items-center gap-1 text-slate-400 text-xs hover:text-rose-400 transition">
                        <Mail className="h-3 w-3" />{m.email}
                      </a>
                      {m.phone && (
                        <a href={`tel:${m.phone}`} className="flex items-center gap-1 text-slate-400 text-xs hover:text-rose-400 transition">
                          <Phone className="h-3 w-3" />{m.phone}
                        </a>
                      )}
                    </div>
                    <p className="text-white text-sm font-medium mt-2">"{m.subject}"</p>
                    {expanded === m.id ? (
                      <p className="text-slate-300 text-sm mt-2 whitespace-pre-wrap">{m.message}</p>
                    ) : (
                      <p className="text-slate-400 text-sm mt-1 truncate">{m.message}</p>
                    )}
                  </div>
                  <div className="flex flex-col items-end gap-2 shrink-0">
                    <p className="text-slate-500 text-xs">{new Date(m.createdAt).toLocaleDateString("en-IN")}</p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={(e) => toggleReadStatus(m.id, m.read, e)}
                        className={`flex items-center gap-1 text-xs transition ${m.read ? 'text-emerald-400 hover:text-emerald-300' : 'text-slate-400 hover:text-emerald-400'}`}
                        title={m.read ? "Mark as unread" : "Mark as read"}
                      >
                        <CheckCircle2 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => setExpanded(expanded === m.id ? null : m.id)}
                        className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-300 transition"
                      >
                        <Eye className="h-4 w-4" />{expanded === m.id ? "Close" : "Read"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
