"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Loader2, Download } from "lucide-react"

interface OrderItem {
  id: string; quantity: number; price: number
  product: { name: string; image: string }
}
interface Order {
  id: string; firstName: string; lastName: string; email: string; phone: string
  address: string; city: string; state: string; pincode: string; notes?: string
  paymentMethod: string; subtotal: number; discount: number; shippingCost: number
  codCharges: number; total: number; status: string; isGift: boolean
  createdAt: string; items: OrderItem[]
}

const STATUSES = ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]
const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-400",
  PROCESSING: "bg-blue-500/20 text-blue-400",
  SHIPPED: "bg-purple-500/20 text-purple-400",
  DELIVERED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [order, setOrder] = useState<Order | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [status, setStatus] = useState("")

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((d) => { setOrder(d); setStatus(d.status); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  const updateStatus = async () => {
    if (!order || status === order.status) return
    setUpdating(true)
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    })
    if (res.ok) setOrder((o) => o ? { ...o, status } : o)
    setUpdating(false)
  }

  if (loading) return <div className="animate-pulse space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-800 rounded-xl" />)}</div>
  if (!order) return <div className="text-red-400">Order not found</div>

  return (
    <div className="max-w-3xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/orders" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white">Order #{order.id.slice(-8)}</h1>
          <p className="text-slate-400 text-sm">{new Date(order.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <Link target="_blank" href={`/orders/${order.id}/invoice`} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg text-sm font-medium transition">
            <Download className="h-4 w-4" />
            Invoice
          </Link>
          <span className={`text-xs px-3 py-1 rounded-full ${STATUS_COLORS[order.status]}`}>
            {order.status}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Customer Info */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-3">Customer</h2>
          <div className="space-y-1 text-sm">
            <p className="text-white">{order.firstName} {order.lastName}</p>
            <p className="text-slate-400">{order.email}</p>
            <p className="text-slate-400">{order.phone}</p>
            {order.isGift && <span className="text-rose-400 text-xs">🎁 Gift Order</span>}
          </div>
          <h3 className="text-white font-medium mt-4 mb-2 text-sm">Delivery Address</h3>
          <p className="text-slate-400 text-sm">{order.address}<br />{order.city}, {order.state} {order.pincode}</p>
          {order.notes && <p className="text-slate-500 text-xs mt-2 italic">Note: {order.notes}</p>}
        </div>

        {/* Payment + Update Status */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
          <h2 className="text-white font-semibold mb-3">Payment</h2>
          <div className="space-y-2 text-sm">
            {[
              ["Method", order.paymentMethod.toUpperCase()],
              ["Subtotal", `₹${order.subtotal.toLocaleString("en-IN")}`],
              ["Discount", `-₹${order.discount.toLocaleString("en-IN")}`],
              ["Shipping", `₹${order.shippingCost.toLocaleString("en-IN")}`],
              ["COD Charges", `₹${order.codCharges.toLocaleString("en-IN")}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-slate-400">{k}</span>
                <span className="text-slate-200">{v}</span>
              </div>
            ))}
            <div className="flex justify-between pt-2 border-t border-slate-700">
              <span className="text-white font-medium">Total</span>
              <span className="text-white font-bold">₹{order.total.toLocaleString("en-IN")}</span>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700">
            <label className="block text-sm font-medium text-slate-300 mb-2">Update Status</label>
            <div className="flex gap-2">
              <select value={status} onChange={(e) => setStatus(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={updateStatus} disabled={updating || status === order.status}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm rounded-lg flex items-center gap-2 transition disabled:opacity-50">
                {updating ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
        <h2 className="text-white font-semibold mb-4">Order Items</h2>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                <Image src={item.product.image || "/placeholder.svg"} alt={item.product.name} width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm">{item.product.name}</p>
                <p className="text-slate-400 text-xs">Qty: {item.quantity} × ₹{item.price.toLocaleString("en-IN")}</p>
              </div>
              <p className="text-white text-sm font-medium">₹{(item.price * item.quantity).toLocaleString("en-IN")}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
