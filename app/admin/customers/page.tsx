"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Users, Search, Loader2 } from "lucide-react"

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const limit = 15

  useEffect(() => {
    fetchCustomers()
  }, [page, search])

  async function fetchCustomers() {
    setLoading(true)
    const q = new URLSearchParams({ page: String(page), limit: String(limit) })
    if (search) q.set("search", search)
    
    try {
      const res = await fetch(`/api/admin/customers?${q}`)
      const d = await res.json()
      setCustomers(d.users || [])
      setTotal(d.total || 0)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Customers</h1>
          <p className="text-slate-400 text-sm">{total} total registered users</p>
        </div>
        
        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full bg-slate-800 border border-slate-700 text-white rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-rose-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center text-slate-400 gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
            <p>Loading customers...</p>
          </div>
        ) : customers.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center justify-center">
            <Users className="h-12 w-12 text-slate-600 mb-4" />
            <p className="text-slate-400 font-medium">No customers found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50 bg-slate-800/80">
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Points</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-400 uppercase tracking-wider">Joined</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {customers.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-600 flex items-center justify-center text-white font-serif font-bold shrink-0 shadow-inner">
                          {c.name?.[0]?.toUpperCase() ?? c.email?.[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-white font-medium text-sm">{c.name || "Unnamed User"}</p>
                          <p className="text-slate-400 text-xs">{c.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${c.role === "admin" ? "bg-purple-500/20 text-purple-400 border border-purple-500/20" : "bg-slate-700 text-slate-300"}`}>
                        {c.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-rose-400 font-mono text-sm font-semibold">
                      {c.loyaltyPoints?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-300 text-sm">
                      {c._count?.orders || 0}
                    </td>
                    <td className="px-6 py-4 text-slate-400 text-sm">
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/admin/customers/${c.id}`} 
                        className="text-xs font-bold bg-slate-700 hover:bg-rose-600 text-white px-4 py-2 rounded-lg transition-colors inline-block"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {total > limit && (
        <div className="flex items-center justify-between mt-4 bg-slate-800/40 p-4 rounded-xl">
          <p className="text-slate-400 text-sm font-medium">
            Showing <span className="text-white">{(page - 1) * limit + 1}</span> to <span className="text-white">{Math.min(page * limit, total)}</span> of <span className="text-white">{total}</span>
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setPage(page - 1)} 
              disabled={page === 1}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors"
            >
              Previous
            </button>
            <button 
              onClick={() => setPage(page + 1)} 
              disabled={page * limit >= total}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white rounded-lg text-sm font-bold transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
