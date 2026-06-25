import type { Metadata } from "next"
import { Suspense } from "react"
import { ProductCard } from "@/components/product-card"
import { ShopFilters } from "@/components/shop/shop-filters"

export const metadata: Metadata = {
  title: "Shop Our Collection",
  description: "Browse our premium collection of handcrafted resin jewelry, including custom pendants, elegant bangles, and unique memorial pieces. Each item preserves natural beauty forever.",
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop Our Collection | Preserved Piece",
    description: "Browse our premium collection of handcrafted resin jewelry.",
    url: "https://preservedpiece.com/shop",
  }
}

async function getProducts(categoryId?: string) {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  const q = categoryId ? `?category=${encodeURIComponent(categoryId)}` : ""
  try {
    const res = await fetch(`${base}/api/products${q}`, { cache: "no-store" })
    if (!res.ok) return []
    const data = await res.json()
    return data.products ?? []
  } catch {
    return []
  }
}

async function getCategories() {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  try {
    const res = await fetch(`${base}/api/categories`, { cache: "no-store" })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const params = await searchParams
  const [products, categories] = await Promise.all([
    getProducts(params.category),
    getCategories(),
  ])

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Our Collection</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">Shop All Pieces</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Each piece is handcrafted with love, preserving nature's beauty in crystal-clear resin
          </p>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 shrink-0">
              <Suspense fallback={<div className="h-64 bg-secondary/30 animate-pulse rounded-xl" />}>
                <ShopFilters categories={categories} />
              </Suspense>
            </aside>

            {/* Products Grid */}
            <div className="flex-1">
              <div className="flex items-center justify-between mb-8">
                <p className="text-sm text-muted-foreground">{products.length} products</p>
              </div>

              {products.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground">
                  <p className="text-lg">No products found</p>
                  <p className="text-sm mt-2">Try a different category or check back later</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {products.map((product: { id: string; name: string; price: number; image: string; category: { name: string }; inStock: boolean }) => (
                    <ProductCard key={product.id} product={{
                      id: product.id,
                      name: product.name,
                      category: product.category?.name ?? "",
                      price: product.price,
                      image: product.image,
                      inStock: product.inStock,
                      customizable: false,
                      description: "",
                      details: [],
                      images: [product.image],
                    }} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
