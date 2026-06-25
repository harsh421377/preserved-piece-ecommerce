"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { ChevronRight, Heart, Truck, Shield, RotateCcw, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/lib/cart-context"
import { formatPrice, cn } from "@/lib/utils"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import type { Product } from "@/lib/products"

interface ProductDetailsProps {
  product: Product
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [wishLoading, setWishLoading] = useState(false)
  const { addItem } = useCart()
  const { data: session } = useSession()
  const router = useRouter()

  // Check if product is already in wishlist on mount
  useEffect(() => {
    if (!session) return
    fetch("/api/user/wishlist")
      .then(r => r.ok ? r.json() : [])
      .then((list: any[]) => {
        if (list.some((item: any) => item.productId === product.id)) {
          setIsWishlisted(true)
        }
      })
      .catch(() => {})
  }, [session, product.id])

  const handleAddToCart = () => {
    if (!session) {
      toast.error("Please login or sign up to add items to your cart")
      router.push(`/login?callbackUrl=/shop/${product.id}`)
      return
    }
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
      })
    }
    toast.success("Added to cart")
  }

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!session) {
      toast.error("Please login or sign up to add items to your wishlist")
      const callbackUrl = typeof window !== "undefined" ? window.location.pathname + window.location.search : `/shop/${product.id}`
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

  const allImages = [product.image, ...product.images.filter((img) => img !== product.image)]

  return (
    <section className="py-8 lg:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link href="/shop" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link
            href={`/collections/${product.category}`}
            className="hover:text-foreground transition-colors capitalize"
          >
            {product.category}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square relative rounded-lg overflow-hidden bg-secondary/50">
              <Image
                src={allImages[selectedImage] || "/placeholder.svg"}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
            </div>

            {allImages.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      "relative w-20 h-20 rounded-lg overflow-hidden shrink-0 border-2 transition-colors",
                      selectedImage === index ? "border-primary" : "border-transparent",
                    )}
                  >
                    <Image
                      src={img || "/placeholder.svg"}
                      alt={`${product.name} ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-primary font-medium mb-2">{product.category}</p>
              <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-serif text-3xl text-foreground">{formatPrice(product.price)}</span>
              {product.originalPrice && (
                <span className="text-lg text-muted-foreground line-through">{formatPrice(product.originalPrice)}</span>
              )}
            </div>

            <p className="text-muted-foreground leading-relaxed">{product.description}</p>

            {/* Badges */}
            <div className="flex flex-wrap gap-2">
              {product.customizable && (
                <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary text-sm px-3 py-1.5 rounded-full">
                  <Sparkles className="h-4 w-4" />
                  Customizable
                </span>
              )}
              {product.inStock && (
                <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-800 text-sm px-3 py-1.5 rounded-full">
                  In Stock
                </span>
              )}
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <div className="flex items-center border border-border rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                >
                  -
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
                >
                  +
                </button>
              </div>

              <Button onClick={handleAddToCart} size="lg" className="flex-1 sm:max-w-xs">
                Add to Cart
              </Button>

              <Button variant="outline" size="lg" className={cn("w-12 shrink-0 transition-all", isWishlisted ? "bg-rose-50 border-rose-300 hover:bg-rose-100" : "bg-transparent")} onClick={handleWishlist} disabled={wishLoading}>
                <Heart className={cn("h-5 w-5 transition-colors", isWishlisted ? "fill-rose-500 text-rose-500" : "")} />
                <span className="sr-only">{isWishlisted ? "Remove from wishlist" : "Add to wishlist"}</span>
              </Button>
            </div>

            {product.customizable && (
              <div className="p-4 bg-secondary/50 rounded-lg">
                <p className="text-sm text-foreground font-medium mb-2">Want this piece customized?</p>
                <p className="text-sm text-muted-foreground mb-3">
                  Add your personal touch with custom colors, flowers, or text.
                </p>
                <Button asChild variant="outline" size="sm" className="bg-transparent">
                  <Link href="/custom-order">Create Custom Order</Link>
                </Button>
              </div>
            )}

            {/* Product Details */}
            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-serif text-lg font-medium text-foreground">Product Details</h3>
              <ul className="space-y-2">
                {product.details.map((detail, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border">
              <div className="text-center">
                <Truck className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Free Shipping</p>
              </div>
              <div className="text-center">
                <Shield className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Secure Checkout</p>
              </div>
              <div className="text-center">
                <RotateCcw className="h-6 w-6 mx-auto text-primary mb-2" />
                <p className="text-xs text-muted-foreground">Easy Returns</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
