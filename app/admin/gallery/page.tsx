"use client"

import { useState, useEffect } from "react"
import { Plus, Trash2, Camera, Heart, Save, Loader2 } from "lucide-react"

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
  likes: number
  featured: boolean
}

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [formUrl, setFormUrl] = useState("")

  const fetchGallery = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/gallery")
      const data = await res.json()
      setImages(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchGallery()
  }, [])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formUrl) return
    await fetch("/api/gallery", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: formUrl }),
    })
    setFormUrl("")
    setShowAdd(false)
    fetchGallery()
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this image?")) return
    await fetch(`/api/gallery/${id}`, { method: "DELETE" })
    fetchGallery()
  }

  const handleUpdateLikes = async (id: string, newLikes: number) => {
    const backup = [...images];
    setImages(imgs => imgs.map(img => img.id === id ? { ...img, likes: newLikes } : img))
    
    try {
      await fetch(`/api/gallery/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ likes: newLikes }),
      })
    } catch {
      setImages(backup)
    }
  }

  if (loading) return <div className="text-white flex items-center gap-2"><Loader2 className="animate-spin h-5 w-5" /> Loading gallery...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Camera className="h-6 w-6 text-purple-400" /> Gallery Manager
          </h1>
          <p className="text-slate-400 text-sm mt-1">Upload images and manage custom like counts.</p>
        </div>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-rose-500 rounded-lg text-white font-medium hover:opacity-90 transition"
        >
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4" /> Add Image</>}
        </button>
      </div>

      {showAdd && (
        <form onSubmit={handleCreate} className="bg-slate-800/60 p-4 rounded-xl border border-slate-700 flex gap-3">
          <input
            type="text"
            required
            placeholder="Image URL (e.g., /12.png or https://...)"
            value={formUrl}
            onChange={(e) => setFormUrl(e.target.value)}
            className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm"
          />
          <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-lg text-sm font-medium transition">
            Upload
          </button>
        </form>
      )}

      {images.length === 0 && !showAdd && (
        <div className="text-center py-20 bg-slate-800/30 rounded-2xl border border-dashed border-slate-700">
          <Camera className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No images in your gallery yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img) => (
          <div key={img.id} className="bg-slate-800/60 rounded-xl border border-slate-700/50 overflow-hidden flex flex-col group relative">
            <div className="aspect-square relative w-full bg-slate-900 border-b border-slate-700/50">
              <img src={img.url} alt="Gallery item" className="w-full h-full object-cover" />
              <button 
                onClick={() => handleDelete(img.id)}
                className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-500 text-white rounded-md opacity-0 group-hover:opacity-100 transition shadow-lg"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-2 w-full">
                <Heart className="h-5 w-5 text-rose-500 fill-rose-500/20 flex-shrink-0" />
                <span className="text-sm text-slate-400">Likes:</span>
                <input
                  type="number"
                  min="0"
                  value={img.likes}
                  onChange={(e) => handleUpdateLikes(img.id, parseInt(e.target.value) || 0)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-md px-2 py-1 text-white text-sm font-medium focus:ring-1 focus:ring-purple-500 outline-none transition"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
