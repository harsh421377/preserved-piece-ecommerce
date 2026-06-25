"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, Download } from "lucide-react"

interface Order {
  id: string; firstName: string; lastName: string; email: string
  total: number; status: string; paymentMethod: string; createdAt: string
  items: Array<{ product: { name: string }; quantity: number }>
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-400 border border-amber-500/20",
  PROCESSING: "bg-blue-500/20 text-blue-400 border border-blue-500/20",
  SHIPPED: "bg-indigo-500/20 text-indigo-400 border border-indigo-500/20",
  OUT_FOR_DELIVERY: "bg-purple-500/20 text-purple-400 border border-purple-500/20",
  DELIVERED: "bg-green-500/20 text-green-400 border border-green-500/20",
  CANCELLED: "bg-red-500/20 text-red-400 border border-red-500/20",
  RETURNED: "bg-orange-500/20 text-orange-400 border border-orange-500/20",
}

const STATUSES = ["ALL", "PENDING", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"]

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [exporting, setExporting] = useState(false)
  const limit = 15

  useEffect(() => {
    setLoading(true)
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (statusFilter !== "ALL") q.set("status", statusFilter)
    fetch(`/api/orders?${q}`)
      .then((r) => r.json())
      .then((d) => { setOrders(d.orders ?? []); setTotal(d.total ?? 0); setLoading(false) })
      .catch(() => setLoading(false))
  }, [statusFilter, page])

  const exportCSV = async () => {
    setExporting(true)
    try {
      const q = new URLSearchParams({ page: "1", limit: "1000" })
      if (statusFilter !== "ALL") q.set("status", statusFilter)
      const res = await fetch(`/api/orders?${q}`)
      const data = await res.json()
      
      const headers = ["Order ID", "Customer Name", "Email", "Phone", "Total (Rs)", "Payment Method", "Status", "Date", "Coupon Code", "Points Redeemed", "Total Items"]
      
      const csvData = data.orders.map((o: any) => [
        o.id,
        `"${o.firstName} ${o.lastName}"`,
        o.email,
        o.phone || "N/A",
        o.total,
        o.paymentMethod,
        o.status,
        new Date(o.createdAt).toLocaleDateString("en-IN"),
        o.couponCode || "None",
        o.pointsRedeemed || 0,
        o.items?.length || 0
      ])
      
      const csvString = [headers.join(","), ...csvData.map((row: any[]) => row.join(","))].join("\n")
      
      const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
      const link = document.createElement("a")
      link.href = URL.createObjectURL(blob)
      link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch(e) {
      alert("Failed to export")
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start sm:items-center justify-between flex-col sm:flex-row gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Orders</h1>
          <p className="text-slate-400 text-sm">{total} total orders</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={exporting || total === 0}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition disabled:opacity-50 shrink-0"
        >
          <Download className="h-4 w-4" />
          {exporting ? "Preparing Export..." : "Export CSV"}
        </button>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              statusFilter === s
                ? "bg-rose-600 text-white"
                : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-10 text-center text-slate-400">
            <div className="animate-spin h-6 w-6 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-2" />
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center">
            <ShoppingCart className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No orders found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {["Order", "Customer", "Items", "Total", "Payment", "Status", "Date"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {orders.map((o) => (
                  <tr key={o.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3">
                      <Link href={`/admin/orders/${o.id}`} className="text-rose-400 hover:underline text-sm font-mono">
                        #{o.id.slice(-8)}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-white text-sm">{o.firstName} {o.lastName}</p>
                      <p className="text-slate-400 text-xs">{o.email}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{o.items.length} item(s)</td>
                    <td className="px-4 py-3 text-white text-sm font-medium">₹{o.total.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3 text-slate-400 text-sm capitalize">{o.paymentMethod}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${STATUS_COLORS[o.status] ?? "bg-slate-700 text-slate-300"}`}>
                        {o.status.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-xs">
                      {new Date(o.createdAt).toLocaleDateString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
