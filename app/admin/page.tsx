"use client"

import { useEffect, useState, useRef } from "react"
import Link from "next/link"
import { Package, ShoppingCart, DollarSign, MessageSquare, TrendingUp, Clock, AlertCircle, Palette, CheckCircle } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

interface Stats {
  totalOrders: number
  pendingOrders: number
  totalProducts: number
  unreadMessages: number
  totalRevenue: number
  todayOrders: number
  totalCustomOrders: number
  pendingCustomOrders: number
  recentOrders: Array<{
    id: string; firstName: string; lastName: string; total: number
    status: string; createdAt: string; items: Array<{ product: { name: string } }>
  }>
  orderStatusDistribution: Array<{ name: string; value: number }>
}

function CountUp({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    let start = 0
    const duration = 1200
    const step = target / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [target])
  return <span>{prefix}{count.toLocaleString("en-IN")}{suffix}</span>
}

function StatCard({ title, value, icon: Icon, color, prefix = "", suffix = "", link }: {
  title: string; value: number; icon: any
  color: string; prefix?: string; suffix?: string; link?: string
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -8
    const rotateY = ((x - centerX) / centerX) * 8
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
  }

  const handleMouseLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = "perspective(600px) rotateX(0) rotateY(0) scale(1)"
  }

  const content = (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transition: "transform 0.15s ease" }}
      className="bg-slate-800/60 backdrop-blur border border-slate-700/50 rounded-2xl p-6 cursor-default hover:border-slate-600 group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <TrendingUp className="h-4 w-4 text-slate-500 group-hover:text-green-400 transition" />
      </div>
      <p className="text-slate-400 text-sm mb-1">{title}</p>
      <p className="text-3xl font-bold text-white">
        <CountUp target={value} prefix={prefix} suffix={suffix} />
      </p>
    </div>
  )

  return link ? <Link href={link}>{content}</Link> : content
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500/20 text-amber-400",
  PROCESSING: "bg-blue-500/20 text-blue-400",
  SHIPPED: "bg-purple-500/20 text-purple-400",
  DELIVERED: "bg-green-500/20 text-green-400",
  CANCELLED: "bg-red-500/20 text-red-400",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch")
        return r.json()
      })
      .then((statsData) => {
        if (statsData.error) {
          setStats(null)
        } else {
          setStats(statsData)
        }
        setLoading(false)
      })
      .catch(() => {
        setStats(null)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-800 rounded w-48" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-36 bg-slate-800 rounded-2xl" />
          ))}
        </div>
      </div>
    )
  }

  if (!stats) return <div className="text-red-400">Failed to load stats</div>

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-slate-400 text-sm mt-1">Welcome back, Admin 👋</p>
      </div>

      {/* Stats Grid — Row 1 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Total Revenue" value={stats.totalRevenue} prefix="₹" icon={DollarSign} color="bg-gradient-to-br from-green-500 to-emerald-600" />
        <StatCard title="Total Orders" value={stats.totalOrders} icon={ShoppingCart} color="bg-gradient-to-br from-blue-500 to-blue-600" link="/admin/orders" />
        <StatCard title="Pending Orders" value={stats.pendingOrders} icon={Clock} color="bg-gradient-to-br from-amber-500 to-orange-500" link="/admin/orders?status=PENDING" />
      </div>

      {/* Stats Grid — Row 2 */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard title="Custom Orders" value={stats.totalCustomOrders} icon={Palette} color="bg-gradient-to-br from-fuchsia-500 to-fuchsia-600" link="/admin/custom-orders" />
        <StatCard title="Products" value={stats.totalProducts} icon={Package} color="bg-gradient-to-br from-violet-500 to-violet-600" link="/admin/products" />
        <StatCard title="Unread Messages" value={stats.unreadMessages} icon={MessageSquare} color="bg-gradient-to-br from-rose-500 to-rose-600" link="/admin/messages" />
      </div>

      {/* Recent Orders + Chart side-by-side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold">Recent Orders</h2>
            <Link href="/admin/orders" className="text-rose-400 text-sm hover:underline">View all</Link>
          </div>
          {stats.recentOrders.length === 0 ? (
            <p className="text-slate-500 text-sm">No orders yet</p>
          ) : (
            <div className="space-y-3">
              {stats.recentOrders.map((order) => (
                <Link
                  key={order.id}
                  href={`/admin/orders/${order.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-slate-700/50 transition"
                >
                  <div>
                    <p className="text-white text-sm font-medium">{order.firstName} {order.lastName}</p>
                    <p className="text-slate-400 text-xs">{order.items[0]?.product?.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white text-sm">₹{order.total.toLocaleString("en-IN")}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_COLORS[order.status] ?? "bg-slate-700 text-slate-300"}`}>
                      {order.status}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Order Status Donut Chart */}
        <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6">
          <h2 className="text-white font-semibold mb-6">Order Status Breakdown</h2>
          <div className="h-72 w-full">
            {stats.orderStatusDistribution && stats.orderStatusDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stats.orderStatusDistribution}
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {stats.orderStatusDistribution.map((entry, index) => {
                      const colors: Record<string, string> = {
                        PENDING: "#f59e0b",
                        PROCESSING: "#3b82f6",
                        SHIPPED: "#a855f7",
                        DELIVERED: "#22c55e",
                        CANCELLED: "#ef4444"
                      }
                      return <Cell key={`cell-${index}`} fill={colors[entry.name] || "#64748b"} />
                    })}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff', borderRadius: '8px' }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500 text-sm">No order data available for chart</div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
