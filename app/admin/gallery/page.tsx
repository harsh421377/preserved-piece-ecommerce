"use client"

import { useState, useEffect, useRef } from "react"
import { Plus, Trash2, Camera, Heart, Save, Loader2, Upload, Link, ImagePlus, X } from "lucide-react"

interface GalleryImage {
  id: string
  url: string
  caption: string
  category: string
  likes: number
  featured: boolean
}

type AddMode = "upload" | "url"

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [addMode, setAddMode] = useState<AddMode>("upload")
  const [formUrl, setFormUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  // Clean up file preview URL on unmount or when file changes
  useEffect(() => {
    return () => {
      if (filePreview) URL.revokeObjectURL(filePreview)
    }
  }, [filePreview])

  const handleFileSelect = (file: File) => {
    setUploadError(null)
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if (!allowedTypes.includes(file.type)) {
      setUploadError("Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("File size exceeds 5MB limit.")
      return
    }
    if (filePreview) URL.revokeObjectURL(filePreview)
    setSelectedFile(file)
    setFilePreview(URL.createObjectURL(file))
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const clearFile = () => {
    setSelectedFile(null)
    if (filePreview) URL.revokeObjectURL(filePreview)
    setFilePreview(null)
    setUploadError(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const resetForm = () => {
    setFormUrl("")
    clearFile()
    setShowAdd(false)
    setUploadError(null)
  }

  const handleUploadFile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedFile) return

    setUploading(true)
    setUploadError(null)

    try {
      // Step 1: Upload file to Cloudinary via /api/upload
      const formData = new FormData()
      formData.append("images", selectedFile)

      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      if (!uploadRes.ok) {
        const err = await uploadRes.json()
        throw new Error(err.error || "Upload failed")
      }

      const uploadData = await uploadRes.json()
      const imageUrl = uploadData.urls?.[0]

      if (!imageUrl) throw new Error("No URL returned from upload")

      // Step 2: Save to gallery
      const galleryRes = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: imageUrl }),
      })

      if (!galleryRes.ok) {
        const err = await galleryRes.json()
        throw new Error(err.error || "Failed to save to gallery")
      }

      resetForm()
      fetchGallery()
    } catch (err: any) {
      setUploadError(err.message || "Something went wrong")
    } finally {
      setUploading(false)
    }
  }

  const handleCreateUrl = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formUrl) return

    setUploading(true)
    setUploadError(null)

    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: formUrl }),
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || "Failed to add image")
      }

      resetForm()
      fetchGallery()
    } catch (err: any) {
      setUploadError(err.message || "Something went wrong")
    } finally {
      setUploading(false)
    }
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
          onClick={() => { showAdd ? resetForm() : setShowAdd(true) }}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-rose-500 rounded-lg text-white font-medium hover:opacity-90 transition"
        >
          {showAdd ? "Cancel" : <><Plus className="h-4 w-4" /> Add Image</>}
        </button>
      </div>

      {showAdd && (
        <div className="bg-slate-800/60 p-5 rounded-xl border border-slate-700 space-y-4">
          {/* Mode Toggle */}
          <div className="flex gap-1 p-1 bg-slate-900/60 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => { setAddMode("upload"); setUploadError(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                addMode === "upload"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Upload className="h-4 w-4" /> Upload from Device
            </button>
            <button
              type="button"
              onClick={() => { setAddMode("url"); setUploadError(null) }}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                addMode === "url"
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-white hover:bg-slate-800/60"
              }`}
            >
              <Link className="h-4 w-4" /> Image URL
            </button>
          </div>

          {/* Upload from Device */}
          {addMode === "upload" && (
            <form onSubmit={handleUploadFile} className="space-y-4">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                onChange={handleFileInputChange}
                className="hidden"
              />

              {!selectedFile ? (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragOver
                      ? "border-purple-400 bg-purple-500/10"
                      : "border-slate-600 hover:border-purple-500/50 hover:bg-slate-700/30"
                  }`}
                >
                  <ImagePlus className={`h-10 w-10 mx-auto mb-3 ${dragOver ? "text-purple-400" : "text-slate-500"}`} />
                  <p className="text-white font-medium">Click to browse or drag & drop</p>
                  <p className="text-slate-500 text-sm mt-1">JPEG, PNG, WEBP, GIF — Max 5MB</p>
                </div>
              ) : (
                <div className="flex items-start gap-4 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
                  {filePreview && (
                    <img
                      src={filePreview}
                      alt="Preview"
                      className="w-20 h-20 object-cover rounded-lg border border-slate-600 flex-shrink-0"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{selectedFile.name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">
                      {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearFile}
                    className="p-1 text-slate-400 hover:text-red-400 transition flex-shrink-0"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedFile || uploading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-lg text-sm font-medium transition"
              >
                {uploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Uploading...</>
                ) : (
                  <><Upload className="h-4 w-4" /> Upload & Add to Gallery</>
                )}
              </button>
            </form>
          )}

          {/* Image URL */}
          {addMode === "url" && (
            <form onSubmit={handleCreateUrl} className="flex gap-3">
              <input
                type="text"
                required
                placeholder="Image URL (e.g., /12.png or https://...)"
                value={formUrl}
                onChange={(e) => setFormUrl(e.target.value)}
                className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-2 text-white text-sm"
              />
              <button
                type="submit"
                disabled={uploading}
                className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-6 py-2 rounded-lg text-sm font-medium transition"
              >
                {uploading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Adding...</>
                ) : (
                  "Add"
                )}
              </button>
            </form>
          )}

          {/* Error Message */}
          {uploadError && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2.5">
              <X className="h-4 w-4 flex-shrink-0" />
              {uploadError}
            </div>
          )}
        </div>
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
