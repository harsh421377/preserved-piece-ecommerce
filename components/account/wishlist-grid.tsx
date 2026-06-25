"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Loader2, Heart, ExternalLink, ShoppingBag } from "lucide-react"
import { toast } from "sonner" // Assuming sonner is installed based on standard nextjs setups, let me just use standard alert if not. Actually package json had sonner

export function WishlistGrid() {
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWishlist()
  }, [])

  async function fetchWishlist() {
    setLoading(true)
    const res = await fetch("/api/user/wishlist")
    if (res.ok) setItems(await res.json())
    setLoading(false)
  }

  async function removeFromWishlist(productId: string) {
    const res = await fetch("/api/user/wishlist", {
      method: "POST",
      body: JSON.stringify({ productId }),
      headers: { "Content-Type": "application/json" }
    })
    
    if (res.ok) {
      toast.success("Removed from wishlist")
      fetchWishlist()
    }
  }

  if (loading) return <div className="py-12 flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-rose-500" /></div>

  if (items.length === 0) {
    return (
      <div className="text-center py-24 bg-card/50 border border-dashed border-border rounded-3xl">
        <Heart className="w-16 h-16 text-muted-foreground mx-auto mb-6 opacity-20" />
        <h3 className="text-xl font-serif text-foreground mb-2">Your wishlist is empty</h3>
        <p className="text-muted-foreground font-medium mb-8">Save items you love and they will appear here.</p>
        <Link href="/shop" className="bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-500/25">
          Explore Collection
        </Link>
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-serif text-foreground mb-8">Your Saved Items</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map(({ product }) => (
          <div key={product.id} className="group relative bg-card rounded-3xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-rose-200 transition-all duration-500">
            <div className="aspect-[4/5] overflow-hidden bg-muted relative">
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <button 
                onClick={(e) => { e.preventDefault(); removeFromWishlist(product.id) }}
                className="absolute top-4 right-4 p-2.5 bg-white/80 hover:bg-white backdrop-blur-md rounded-full shadow-lg text-rose-500 transform transition-transform hover:scale-110"
              >
                <Heart className="w-5 h-5 fill-rose-500 stroke-rose-500" />
              </button>
            </div>
            
            <div className="p-6">
              <Link href={`/product/${product.id}`} className="block">
                <h3 className="font-serif text-lg text-foreground mb-2 group-hover:text-rose-600 transition-colors">{product.name}</h3>
                <div className="flex items-center gap-3">
                  <span className="text-lg font-medium text-foreground">₹{product.price.toLocaleString()}</span>
                  {product.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">₹{product.originalPrice.toLocaleString()}</span>
                  )}
                </div>
              </Link>
              
              <div className="mt-6 flex gap-3">
                {product.customizable ? (
                  <Link href={`/custom-order?product=${product.id}`} className="flex-1 text-center bg-background border-2 border-border hover:border-rose-300 text-foreground px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm">
                    Customize
                  </Link>
                ) : (
                  <button disabled={!product.inStock} className="flex-1 bg-gradient-to-r from-rose-600/10 to-purple-600/10 hover:from-rose-600 hover:to-purple-600 text-rose-600 hover:text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm flex items-center justify-center gap-2">
                    <ShoppingBag className="w-4 h-4" /> {product.inStock ? "Add to Cart" : "Out of Stock"}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
