"use client"

import { useEffect, useState } from "react"
import { Loader2, Pencil, Trash2, Plus, Check, X } from "lucide-react"

interface Category { id: string; name: string; description?: string; _count?: { products: number } }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState({ name: "", description: "" })
  const [newForm, setNewForm] = useState({ id: "", name: "", description: "" })
  const [adding, setAdding] = useState(false)
  const [saving, setSaving] = useState(false)

  const load = () => {
    setLoading(true)
    fetch("/api/categories").then(r => r.json()).then(d => { setCategories(d); setLoading(false) })
  }
  useEffect(load, [])

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true)
    await fetch("/api/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newForm) })
    setNewForm({ id: "", name: "", description: "" }); setAdding(false); setSaving(false); load()
  }

  const handleEdit = async (id: string) => {
    setSaving(true)
    await fetch(`/api/categories/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) })
    setEditId(null); setSaving(false); load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this category? Products in this category will be affected.")) return
    await fetch(`/api/categories/${id}`, { method: "DELETE" })
    load()
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Categories</h1>
        <button onClick={() => setAdding(true)} className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-sm font-medium transition">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {adding && (
        <form onSubmit={handleAdd} className="bg-slate-800/60 border border-rose-500/30 rounded-2xl p-5 space-y-3">
          <h2 className="text-white font-medium">New Category</h2>
          <input value={newForm.id} onChange={e => setNewForm(f => ({ ...f, id: e.target.value }))} required placeholder="ID (e.g., rings)" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          <input value={newForm.name} onChange={e => setNewForm(f => ({ ...f, name: e.target.value }))} required placeholder="Name (e.g., Rings)" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          <input value={newForm.description} onChange={e => setNewForm(f => ({ ...f, description: e.target.value }))} placeholder="Description (optional)" className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
          <div className="flex gap-2">
            <button type="button" onClick={() => setAdding(false)} className="flex-1 py-2 bg-slate-700 hover:bg-slate-600 text-white text-sm rounded-lg transition">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white text-sm rounded-lg flex items-center justify-center gap-2 transition">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create"}
            </button>
          </div>
        </form>
      )}

      <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400 animate-pulse">Loading...</div>
        ) : (
          <div className="divide-y divide-slate-700/30">
            {categories.map((c) => (
              <div key={c.id} className="px-5 py-4">
                {editId === c.id ? (
                  <div className="space-y-2">
                    <input value={editForm.name} onChange={e => setEditForm(f => ({ ...f, name: e.target.value }))} className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                    <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(c.id)} disabled={saving} className="p-1.5 rounded text-green-400 hover:bg-green-500/10 transition"><Check className="h-4 w-4" /></button>
                      <button onClick={() => setEditId(null)} className="p-1.5 rounded text-slate-400 hover:bg-slate-600 transition"><X className="h-4 w-4" /></button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">{c.name} <span className="text-xs text-slate-500 ml-1">({c.id})</span></p>
                      {c.description && <p className="text-slate-400 text-xs">{c.description}</p>}
                      <p className="text-slate-500 text-xs mt-0.5">{c._count?.products ?? 0} products</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditId(c.id); setEditForm({ name: c.name, description: c.description ?? "" }) }}
                        className="p-1.5 rounded text-slate-400 hover:text-white hover:bg-slate-600 transition"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => handleDelete(c.id)} className="p-1.5 rounded text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition">
                        <Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
