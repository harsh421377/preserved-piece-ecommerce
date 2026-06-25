"use client"

import { useEffect, useState } from "react"
import { Palette, CheckCircle, XCircle } from "lucide-react"

interface CustomOrder {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  productType: string
  colorPreference: string
  decorativeElements: string | null
  personalization: string | null
  story: string
  timeline: string | null
  budget: string | null
  referenceImages: string | null
  status: string
  createdAt: string
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/20",
  COMPLETED: "bg-emerald-500/20 text-emerald-400 border border-emerald-500/20",
  REJECTED: "bg-red-500/20 text-red-400 border border-red-500/20",
}

const STATUSES = ["ALL", "PENDING", "COMPLETED", "REJECTED"]

export default function AdminCustomOrdersPage() {
  const [orders, setOrders] = useState<CustomOrder[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const limit = 15

  const fetchOrders = () => {
    setLoading(true)
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (statusFilter !== "ALL") q.set("status", statusFilter)

    fetch(`/api/admin/custom-orders?${q}`)
      .then((r) => r.json())
      .then((d) => {
        setOrders(d.orders ?? [])
        setTotal(d.total ?? 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchOrders()
  }, [statusFilter, page])

  const updateOrderStatus = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/custom-orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) fetchOrders()
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-fuchsia-500/20 text-fuchsia-400 rounded-xl shadow-lg shadow-fuchsia-500/10">
          <Palette className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-white">Custom Orders</h1>
          <p className="text-slate-400 text-sm">{total} total requests</p>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${statusFilter === s
                ? "bg-fuchsia-600 text-white shadow-md shadow-fuchsia-500/20"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 relative min-h-[400px]">
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center">
              <div className="animate-spin h-8 w-8 border-2 border-fuchsia-500 border-t-transparent rounded-full mb-3" />
              <p className="text-slate-400 text-sm">Loading requests...</p>
            </div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 opacity-70">
            <Palette className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 text-lg font-medium">No custom orders found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {orders.map((order) => (
              <div key={order.id} className="bg-slate-900/60 border border-slate-700/80 hover:border-fuchsia-500/30 transition-all p-5 rounded-xl flex flex-col h-full group">
                <div className="min-h-0 flex-1">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <p className="text-white font-medium text-lg">{order.firstName} {order.lastName}</p>
                      <p className="text-slate-500 text-xs mt-0.5 font-medium">{new Date(order.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider font-bold ${STATUS_COLORS[order.status] || "bg-slate-700 text-slate-300"}`}>
                        {order.status}
                      </span>
                      <span className="bg-slate-800 text-slate-300 text-[10px] px-2 py-1 rounded-md uppercase tracking-wider font-semibold border border-slate-700">
                        {order.productType}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-5">
                    <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">Contact Details</p>
                      <p className="text-slate-300 text-xs truncate" title={order.email}>{order.email}</p>
                      <p className="text-slate-300 text-xs">{order.phone}</p>
                    </div>

                    <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">Preferences</p>
                      <p className="text-slate-300 text-xs truncate"><span className="text-slate-500">Color:</span> {order.colorPreference}</p>
                      <p className="text-slate-300 text-xs truncate"><span className="text-slate-500">Budget:</span> {order.budget || "N/A"}</p>
                    </div>

                    {((order as any).address || (order as any).city) && (
                      <div className="col-span-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30 mt-1">
                        <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1">Delivery Address</p>
                        <p className="text-slate-300 text-xs">
                          {(order as any).address && <>{(order as any).address}<br /></>}
                          {[(order as any).city, (order as any).state, (order as any).pincode].filter(Boolean).join(", ")}
                        </p>
                      </div>
                    )}

                    {(order.decorativeElements || order.personalization || order.timeline) && (
                      <div className="col-span-2 bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/30 mt-1">
                        <div className="flex flex-wrap gap-x-4 gap-y-1">
                          {order.timeline && <p className="text-slate-300 text-xs"><span className="text-slate-500">Timeline:</span> {order.timeline}</p>}
                          {order.decorativeElements && <p className="text-slate-300 text-xs"><span className="text-slate-500">Decor:</span> {order.decorativeElements}</p>}
                          {order.personalization && <p className="text-slate-300 text-xs"><span className="text-slate-500">Text:</span> {order.personalization}</p>}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mb-4">
                    <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1.5 ml-1">Vision & Story</p>
                    <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 shadow-inner">
                      <p className="text-slate-300 text-sm/relaxed italic">
                        "{order.story}"
                      </p>
                    </div>
                  </div>

                  {order.referenceImages && (
                    <div className="mb-4">
                      <p className="text-slate-500 text-[10px] uppercase tracking-wider font-bold mb-1.5 ml-1">Reference Photos</p>
                      <div className="flex gap-2 overflow-x-auto pb-2">
                        {JSON.parse(order.referenceImages).map((url: string, idx: number) => (
                          <a key={idx} href={url} target="_blank" rel="noopener noreferrer">
                            <img src={url} alt="Reference" className="h-16 w-16 object-cover rounded-lg border border-slate-700/50 hover:border-fuchsia-500/50 transition" />
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {order.status === "PENDING" && (
                  <div className="mt-auto pt-4 border-t border-slate-800 flex gap-3">
                    <button
                      onClick={() => updateOrderStatus(order.id, "COMPLETED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/20 hover:border-emerald-500/40 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Mark Completed
                    </button>
                    <button
                      onClick={() => updateOrderStatus(order.id, "REJECTED")}
                      className="flex-1 flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-500/10 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/30 px-4 py-2.5 rounded-lg text-sm font-medium transition-all"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject
                    </button>
                  </div>
                )}

                {order.status !== "PENDING" && (
                  <div className="mt-auto pt-4 border-t border-slate-800 flex justify-end">
                    <button
                      onClick={() => updateOrderStatus(order.id, "PENDING")}
                      className="text-slate-500 hover:text-slate-300 text-xs font-medium underline transition-colors"
                    >
                      Revert to Pending
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > limit && (
        <div className="flex items-center justify-between">
          <p className="text-slate-400 text-sm">
            Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
          </p>
          <div className="flex gap-2">
            <button onClick={() => setPage(page - 1)} disabled={page === 1}
              className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition">
              Prev
            </button>
            <button onClick={() => setPage(page + 1)} disabled={page * limit >= total}
              className="px-3 py-1.5 bg-slate-800 text-slate-400 rounded-lg text-sm disabled:opacity-50 hover:bg-slate-700 transition">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
