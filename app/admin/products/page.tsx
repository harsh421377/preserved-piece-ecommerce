"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Plus, Pencil, Trash2, Search, Package } from "lucide-react"

interface Product {
  id: string; name: string; price: number; inStock: boolean; stockQuantity: number
  featured: boolean; image: string; category: { name: string }
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = () => {
    setLoading(true)
    const q = search ? `?search=${encodeURIComponent(search)}` : ""
    fetch(`/api/products${q}`)
      .then((r) => r.json())
      .then((d) => { setProducts(d.products ?? []); setLoading(false) })
      .catch(() => setLoading(false))
  }

  useEffect(() => { fetchProducts() }, [])

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return
    setDeleting(id)
    await fetch(`/api/products/${id}`, { method: "DELETE" })
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setDeleting(null)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Products</h1>
          <p className="text-slate-400 text-sm">{products.length} total products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition"
        >
          <Plus className="h-4 w-4" /> Add Product
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && fetchProducts()}
          placeholder="Search products... (press Enter)"
          className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
        />
      </div>

      {/* Table */}
      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">
            <div className="animate-spin h-6 w-6 border-2 border-rose-500 border-t-transparent rounded-full mx-auto mb-2" />
            Loading...
          </div>
        ) : products.length === 0 ? (
          <div className="p-12 text-center">
            <Package className="h-10 w-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400">No products found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700/50">
                  {["Product", "Category", "Price", "Stock", "Featured", "Actions"].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-700/30 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                          <Image src={p.image || "/placeholder.svg"} alt={p.name} width={40} height={40} className="object-cover w-full h-full" />
                        </div>
                        <span className="text-white text-sm font-medium">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-400 text-sm">{p.category?.name}</td>
                    <td className="px-4 py-3 text-white text-sm">₹{p.price.toLocaleString("en-IN")}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${p.inStock ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>
                          {p.inStock ? "In Stock" : "Out of Stock"}
                        </span>
                        <span className="text-xs text-slate-400 pl-1">{p.stockQuantity} items</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {p.featured && <span className="text-xs px-2 py-1 rounded-full bg-rose-500/20 text-rose-400">Featured</span>}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-600 transition"
                        >
                          <Pencil className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleting === p.id}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition disabled:opacity-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
