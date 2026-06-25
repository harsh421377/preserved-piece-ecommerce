"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart-context"
import { formatPrice, cn } from "@/lib/utils"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/products"

interface ProductCardProps {
  product: Product
  wishlistedIds?: string[]
}

export function ProductCard({ product, wishlistedIds = [] }: ProductCardProps) {
  const { addItem } = useCart()
  const { data: session } = useSession()
  const router = useRouter()
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishLoading, setWishLoading] = useState(false)

  useEffect(() => {
    if (wishlistedIds.includes(product.id)) {
      setIsWishlisted(true)
    }
  }, [wishlistedIds, product.id])

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session) {
      toast.error("Please login or sign up to add items to your cart")
      const callbackUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : `/shop/${product.id}`
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      return
    }
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    })
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!session) {
      toast.error("Please login or sign up to add items to your wishlist")
      const callbackUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/shop"
      router.push(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`)
      return
    }
    setWishLoading(true)
    try {
      const res = await fetch("/api/user/wishlist", {
        method: "POST",
        body: JSON.stringify({ productId: product.id }),
        headers: { "Content-Type": "application/json" }
      })
      if (res.ok) {
         const data = await res.json()
         if (data.action === "added") {
           setIsWishlisted(true)
           toast.success("Added to wishlist!", { icon: "❤️" })
         } else {
           setIsWishlisted(false)
           toast.success("Removed from wishlist", { icon: "💔" })
         }
      }
    } catch (err) {
      toast.error("Could not update wishlist")
    } finally {
      setWishLoading(false)
    }
  }

  return (
    <Link href={`/shop/${product.id}`} className="group">
      <div className="relative aspect-square overflow-hidden rounded-lg bg-secondary/50">
        <Image
          src={product.image || "/placeholder.svg"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.originalPrice && (
            <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded">Sale</span>
          )}
          {product.customizable && (
            <span className="bg-foreground/80 text-background text-xs font-medium px-2 py-1 rounded">Customizable</span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          className={cn(
            "absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur flex items-center justify-center transition-all",
            isWishlisted
              ? "bg-rose-100 text-rose-500 opacity-100"
              : "bg-background/80 text-foreground opacity-0 group-hover:opacity-100 hover:bg-background"
          )}
          onClick={handleWishlist}
          disabled={wishLoading}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={cn("h-4 w-4 transition-colors", isWishlisted && "fill-rose-500 text-rose-500")} />
        </button>

        {/* Quick Add */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0">
          <Button onClick={handleAddToCart} className="w-full" size="sm">
            Add to Cart
          </Button>
        </div>
      </div>

      <div className="mt-4 space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">{product.category}</p>
        <h3 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <div className="flex items-center gap-2">
          <span className="font-medium text-foreground">{formatPrice(product.price)}</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
