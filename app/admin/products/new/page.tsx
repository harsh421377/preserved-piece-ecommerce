"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"

interface Category { id: string; name: string }

export default function NewProductPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<Category[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")
  const [uploading, setUploading] = useState(false)
  const [form, setForm] = useState<{
    name: string; description: string; price: string; originalPrice: string;
    categoryId: string; image: string; images: string[];
    customizable: boolean; inStock: boolean; featured: boolean; stockQuantity: string;
  }>({
    name: "", description: "", price: "", originalPrice: "",
    categoryId: "", image: "", images: [],
    customizable: false, inStock: true, featured: false, stockQuantity: "10"
  })

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    setUploading(true)
    const formData = new FormData()
    Array.from(e.target.files).forEach((file) => formData.append("images", file))
    
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData })
      if (!res.ok) throw new Error("Upload failed")
      const data = await res.json()
      
      setForm(prev => {
        const newImages = [...prev.images, ...data.urls]
        return { ...prev, images: newImages, image: prev.image || newImages[0] || "" }
      })
    } catch (err) {
      setError("Failed to upload images")
    } finally {
      setUploading(false)
    }
  }

  const removeImage = (index: number) => {
    setForm(prev => {
      const newImages = [...prev.images]
      newImages.splice(index, 1)
      return { ...prev, images: newImages, image: prev.image === prev.images[index] ? (newImages[0] || "") : prev.image }
    })
  }

  const setPrimaryImage = (url: string) => setForm(prev => ({ ...prev, image: url }))
  useEffect(() => {
    fetch("/api/categories").then((r) => r.json()).then(setCategories)
  }, [])

  const set = (k: string, v: unknown) => setForm((f) => ({ ...f, [k]: v }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError("")
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: parseFloat(form.price),
        originalPrice: form.originalPrice ? parseFloat(form.originalPrice) : undefined,
        stockQuantity: parseInt(form.stockQuantity || "0", 10),
      }),
    })
    if (res.ok) {
      router.push("/admin/products")
    } else {
      const d = await res.json()
      if (d.details && Array.isArray(d.details)) {
        setError(`${d.error}: ${d.details.map((x: any) => `${x.path.join('.')} - ${x.message}`).join(", ")}`)
      } else {
        setError(d.error ?? "Failed to create product")
      }
      setSaving(false)
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/products" className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition">
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-bold text-white">Add New Product</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-6 space-y-5">
        {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm p-3 rounded-lg">{error}</div>}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Product Images *</label>
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {form.images.map((url, i) => (
                <div key={i} className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer ${form.image === url ? 'border-rose-500' : 'border-slate-700'}`} onClick={() => setPrimaryImage(url)}>
                  <img src={url} alt={`Upload ${i}`} className="w-full h-full object-cover" />
                  <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(i); }} className="absolute text-xs top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center">×</button>
                  {form.image === url && <div className="absolute bottom-0 w-full bg-rose-500 text-white text-[10px] text-center py-0.5">Primary</div>}
                </div>
              ))}
              <label className="border-2 border-dashed border-slate-600 rounded-lg flex flex-col items-center justify-center text-slate-400 hover:text-white hover:border-slate-400 transition cursor-pointer aspect-square">
                {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <div className="text-center font-bold text-2xl">+</div>}
                <span className="text-xs mt-1">Add Photos</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
              </label>
            </div>
            <p className="text-xs text-slate-500">Click an image to set it as the primary photo. First uploaded photo is primary by default.</p>
          </div>
        </div>

        {[
          { label: "Product Name *", key: "name", type: "text", placeholder: "e.g. Rose Petal Pendant" },
          { label: "Price (₹) *", key: "price", type: "number", placeholder: "2499" },
          { label: "Original Price (₹)", key: "originalPrice", type: "number", placeholder: "2999" },
          { label: "Stock Quantity *", key: "stockQuantity", type: "number", placeholder: "10" },
        ].map(({ label, key, type, placeholder }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>
            <input
              type={type}
              value={(form as Record<string, unknown>)[key] as string}
              onChange={(e) => set(key, e.target.value)}
              required={label.includes("*")}
              placeholder={placeholder}
              className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
            />
          </div>
        ))}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Category *</label>
          <select
            value={form.categoryId}
            onChange={(e) => set("categoryId", e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm"
          >
            <option value="">Select a category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">Description *</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            required
            rows={4}
            placeholder="Describe the product..."
            className="w-full px-4 py-2.5 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-rose-500 text-sm resize-none"
          />
        </div>

        <div className="flex gap-6">
          {[
            { key: "inStock", label: "In Stock" },
            { key: "customizable", label: "Customizable" },
            { key: "featured", label: "Featured" },
          ].map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={(form as Record<string, unknown>)[key] as boolean}
                onChange={(e) => set(key, e.target.checked)}
                className="w-4 h-4 rounded accent-rose-500"
              />
              <span className="text-sm text-slate-300">{label}</span>
            </label>
          ))}
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/admin/products" className="flex-1 py-2.5 bg-slate-700 hover:bg-slate-600 text-white text-sm font-medium rounded-lg text-center transition">
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 transition disabled:opacity-70"
          >
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Create Product"}
          </button>
        </div>
      </form>
    </div>
  )
}
