"use client"

import { useState, useEffect } from "react"
import { Loader2, Package, Search, ChevronDown, ChevronUp, MapPin, Receipt, Clock, Ban, ArrowLeftRight } from "lucide-react"

export function OrderList() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [filter, setFilter] = useState("ALL") // ALL, DELIVERED, ONGOING, CANCELLED

  useEffect(() => {
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    const res = await fetch("/api/user/orders")
    if (res.ok) setOrders(await res.json())
    setLoading(false)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "DELIVERED": return "bg-green-100 text-green-700"
      case "CANCELLED": return "bg-red-100 text-red-700"
      case "SHIPPED":
      case "OUT_FOR_DELIVERY": return "bg-blue-100 text-blue-700"
      default: return "bg-orange-100 text-orange-700"
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this order?")) return
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "cancel" }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) fetchOrders()
  }

  const handleReturn = async (id: string) => {
    const reason = prompt("Please provide a reason for return:")
    if (!reason) return
    const res = await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ action: "return", reason }),
      headers: { "Content-Type": "application/json" }
    })
    if (res.ok) {
      alert("Return requested successfully.")
      fetchOrders()
    }
  }

  const filteredOrders = orders.filter(o => {
    if (filter === "ALL") return true
    if (filter === "DELIVERED") return o.status === "DELIVERED"
    if (filter === "CANCELLED") return o.status === "CANCELLED"
    return o.status === "PENDING" || o.status === "PROCESSING" || o.status === "SHIPPED" || o.status === "OUT_FOR_DELIVERY"
  })

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between gap-4 mb-8">
        <h2 className="text-2xl font-serif text-foreground">Order History</h2>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
          {["ALL", "ONGOING", "DELIVERED", "CANCELLED"].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${filter === f ? "bg-gradient-to-r from-rose-600 to-purple-600 text-white shadow-md shadow-rose-500/20" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-24 bg-card/50 border border-dashed border-border rounded-3xl">
          <Package className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
          <h3 className="text-xl font-serif text-foreground mb-2">No orders found</h3>
          <p className="text-muted-foreground font-medium mb-8">Looks like you haven't placed any orders in this category yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div key={order.id} className="bg-card border border-border/50 rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">

              {/* Order Header / Summary */}
              <div
                className="p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 bg-muted/20"
                onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}
              >
                <div className="flex items-center gap-8 flex-1">
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Order Placed</p>
                    <p className="font-medium text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Total Amount</p>
                    <p className="font-medium text-foreground">₹{order.total.toLocaleString()}</p>
                  </div>
                  <div className="hidden sm:block">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider mb-1">Order #</p>
                    <p className="font-medium text-foreground font-mono">{order.id.slice(-8).toUpperCase()}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4 md:mt-0">
                  <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${getStatusColor(order.status)} shrink-0`}>
                    {order.status.replace(/_/g, " ")}
                  </span>
                  {expandedId === order.id ? <ChevronUp className="w-5 h-5 text-muted-foreground" /> : <ChevronDown className="w-5 h-5 text-muted-foreground" />}
                </div>
              </div>

              {/* Order Details (Expanded) */}
              {expandedId === order.id && (
                <div className="p-6 border-t border-border/50 animate-in slide-in-from-top-4 fade-in duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Items */}
                    <div className="lg:col-span-2 space-y-6">
                      <h3 className="font-bold text-foreground flex items-center gap-2">
                        <Package className="w-4 h-4 text-rose-500" /> Items Ordered
                      </h3>
                      <div className="space-y-4">
                        {order.items.map((item: any) => (
                          <div key={item.id} className="flex gap-4 p-4 border border-border/40 rounded-2xl bg-background/50">
                            <img src={item.product.image} alt={item.product.name} className="w-20 h-20 object-cover rounded-xl" />
                            <div className="flex-1">
                              <h4 className="font-bold text-foreground">{item.product.name}</h4>
                              <p className="text-muted-foreground text-sm mt-1">Qty: {item.quantity}</p>
                              <p className="font-medium text-foreground mt-2">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                            {order.status === "DELIVERED" && (
                              <button className="text-sm font-bold text-rose-600 hover:text-rose-700 bg-rose-50 px-4 py-2 rounded-xl self-start">
                                Write Review
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Meta Details */}
                    <div className="space-y-8 lg:border-l border-border/50 lg:pl-8">
                      <div>
                        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-rose-500" /> Shipping Address
                        </h3>
                        <p className="text-sm text-foreground mb-1 font-medium">{order.firstName} {order.lastName}</p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {order.address}<br />
                          {order.city}, {order.state} {order.pincode}
                        </p>
                      </div>

                      <div>
                        <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-rose-500" /> Payment Summary
                        </h3>
                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex justify-between"><span>Subtotal</span><span>₹{order.subtotal.toLocaleString()}</span></div>
                          <div className="flex justify-between"><span>Shipping</span><span>₹{order.shippingCost.toLocaleString()}</span></div>
                          <div className="flex justify-between font-bold text-foreground border-t border-border/50 pt-2 mt-2">
                            <span>Total</span><span>₹{order.total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>

                      {/* Tracker UI */}
                      <div>
                        <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-rose-500" /> Tracking Status
                        </h3>
                        <div className="relative border-l-2 border-rose-200 ml-2 space-y-6 pb-2">
                          {["PENDING", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED"].map((st, i, arr) => {
                            const passed = arr.indexOf(st) <= arr.indexOf(order.status)
                            if (order.status === "CANCELLED" && i > 0) return null
                            return (
                              <div key={st} className="relative pl-6">
                                <span className={`absolute -left-[5px] top-1 w-2 h-2 rounded-full ring-4 ${passed ? "bg-rose-500 ring-rose-100" : "bg-border ring-background"} transition-colors`} />
                                <p className={`text-sm font-bold ${passed ? "text-foreground" : "text-muted-foreground"}`}>{st.replace(/_/g, " ")}</p>
                              </div>
                            )
                          })}
                        </div>
                        {order.trackingId && (
                          <p className="text-xs font-mono text-muted-foreground mt-4 bg-muted p-2 rounded-lg">Tracker: {order.trackingId} via {order.carrier || "Carrier"}</p>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="pt-4 border-t border-border/50 flex flex-col gap-3">
                        <button className="w-full border border-border bg-background hover:bg-muted text-foreground px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
                          Download Invoice
                        </button>

                        {(order.status === "PENDING" || order.status === "PROCESSING") && (
                          <button onClick={() => handleCancel(order.id)} className="w-full flex items-center justify-center gap-2 text-red-500 hover:text-red-600 hover:bg-red-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
                            <Ban className="w-4 h-4" /> Cancel Order
                          </button>
                        )}

                        {order.status === "DELIVERED" && order.returnStatus !== "REQUESTED" && (
                          <button onClick={() => handleReturn(order.id)} className="w-full flex items-center justify-center gap-2 text-orange-500 hover:text-orange-600 hover:bg-orange-50 px-4 py-2.5 rounded-xl text-sm font-bold transition-colors">
                            <ArrowLeftRight className="w-4 h-4" /> Request Return
                          </button>
                        )}

                        {order.returnStatus === "REQUESTED" && (
                          <p className="text-xs text-orange-600 font-bold text-center bg-orange-50 p-2 rounded-xl">Return request under review.</p>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
