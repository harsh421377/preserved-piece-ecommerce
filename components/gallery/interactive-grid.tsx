"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  url: string
  caption: string | null
  category: string | null
  likes: number
  hasLiked?: boolean
}

function formatLikes(likes: number): string {
  if (likes >= 1000) {
    const k = likes / 1000
    return k % 1 === 0 ? `${k}k` : `${k.toFixed(1)}k`
  }
  return likes.toString()
}

export function InteractiveGallery({ initialImages }: { initialImages: GalleryImage[] }) {
  const [images, setImages] = useState(initialImages)
  const [animatingHeart, setAnimatingHeart] = useState<string | null>(null)
  const { data: session } = useSession()
  const router = useRouter()

  const handleLike = async (id: string, e?: React.MouseEvent) => {
    e?.preventDefault()
    e?.stopPropagation()

    if (!session) {
      toast.error("Please login or sign up to like images")
      router.push("/login?callbackUrl=/gallery")
      return
    }

    const currentImage = images.find((img) => img.id === id)
    if (!currentImage) return

    const wasLiked = !!currentImage.hasLiked

    // Optimistic UI update
    setImages((imgs) =>
      imgs.map((img) =>
        img.id === id
          ? {
              ...img,
              hasLiked: !wasLiked,
              likes: wasLiked ? img.likes - 1 : img.likes + 1,
            }
          : img
      )
    )

    if (!wasLiked) {
      setAnimatingHeart(id)
      setTimeout(() => setAnimatingHeart(null), 1000)
    }

    try {
      const res = await fetch(`/api/gallery/${id}/like`, { method: "POST" })
      if (!res.ok) {
        throw new Error("Failed to toggle like")
      }
      const data = await res.json()
      // Sync state with server response
      setImages((imgs) =>
        imgs.map((img) =>
          img.id === id
            ? {
                ...img,
                likes: data.likes,
                hasLiked: data.hasLiked,
              }
            : img
        )
      )
    } catch {
      // Revert if API fails
      setImages((imgs) =>
        imgs.map((img) =>
          img.id === id
            ? {
                ...img,
                hasLiked: wasLiked,
                likes: currentImage.likes,
              }
            : img
        )
      )
      toast.error("Could not update like status")
    }
  }

  if (images.length === 0) {
    return (
      <div className="text-center py-20 text-muted-foreground">
        <p>No images have been posted to the gallery yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {images.map((img) => (
        <div
          key={img.id}
          className="relative group overflow-hidden rounded-lg aspect-square cursor-pointer bg-secondary/20"
          onDoubleClick={() => handleLike(img.id)}
        >
          <Image
            src={img.url}
            alt={img.caption || "Gallery creation"}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {img.caption && <p className="text-white font-medium text-sm sm:text-base leading-tight mb-1">{img.caption}</p>}
            {img.category && <p className="text-white/70 text-xs uppercase tracking-wider">{img.category}</p>}
          </div>

          <button
            onClick={(e) => handleLike(img.id, e)}
            className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/40 backdrop-blur-md rounded-full px-3 py-1.5 hover:bg-black/60 transition-colors"
          >
            <Heart
              className={`h-4 w-4 transition-all duration-300 ${
                img.hasLiked ? "fill-rose-500 text-rose-500 scale-110" : "text-white"
              } ${animatingHeart === img.id ? "scale-125" : ""}`}
            />
            <span className="text-white text-xs font-semibold">{formatLikes(img.likes)}</span>
          </button>

          {/* Big heartbeat animation overlay */}
          {animatingHeart === img.id && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
              <Heart className="h-20 w-20 text-rose-500 fill-rose-500 animate-ping opacity-70" />
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
