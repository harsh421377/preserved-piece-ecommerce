import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProductDetails } from "@/components/shop/product-details"
import { ProductCard } from "@/components/product-card"
import type { Product } from "@/lib/products"

interface ProductPageProps {
  params: Promise<{ id: string }>
}

async function getProductFromDB(id: string): Promise<Product | null> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  try {
    const res = await fetch(`${base}/api/products/${id}`, { cache: "no-store" })
    if (!res.ok) return null
    const p = await res.json()
    if (!p || p.error) return null

    // Normalise DB shape → Product interface shape
    return {
      id: p.id,
      name: p.name,
      category: p.category?.name ?? "",
      price: p.price,
      originalPrice: p.originalPrice ?? undefined,
      image: p.image,
      images: p.images?.map((i: { url: string }) => i.url) ?? [p.image],
      description: p.description ?? "",
      details: p.details?.map((d: { text: string }) => d.text) ?? [],
      customizable: p.customizable ?? false,
      inStock: p.inStock ?? true,
      featured: p.featured ?? false,
    }
  } catch {
    return null
  }
}

async function getRelatedFromDB(categoryName: string, excludeId: string): Promise<Product[]> {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  try {
    const res = await fetch(
      `${base}/api/products?category=${encodeURIComponent(categoryName)}&limit=4`,
      { cache: "no-store" }
    )
    if (!res.ok) return []
    const data = await res.json()
    const list: Product[] = (data.products ?? [])
      .filter((p: { id: string }) => p.id !== excludeId)
      .slice(0, 4)
      .map((p: {
        id: string; name: string; category: { name: string };
        price: number; originalPrice?: number; image: string;
        images?: { url: string }[]; description?: string;
        details?: { text: string }[]; customizable?: boolean;
        inStock?: boolean; featured?: boolean;
      }) => ({
        id: p.id,
        name: p.name,
        category: p.category?.name ?? "",
        price: p.price,
        originalPrice: p.originalPrice ?? undefined,
        image: p.image,
        images: p.images?.map((i) => i.url) ?? [p.image],
        description: p.description ?? "",
        details: p.details?.map((d) => d.text) ?? [],
        customizable: p.customizable ?? false,
        inStock: p.inStock ?? true,
        featured: p.featured ?? false,
      }))
    return list
  } catch {
    return []
  }
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductFromDB(id)

  if (!product) {
    return { title: "Product Not Found | Preserved Piece" }
  }

  return {
    title: `${product.name} | Preserved Piece`,
    description: product.description,
  }
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params
  const product = await getProductFromDB(id)

  if (!product) {
    notFound()
  }

  const relatedProducts = await getRelatedFromDB(product.category, product.id)

  return (
    <div className="min-h-screen">
      <ProductDetails product={product} />

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-16 lg:py-24 bg-secondary/30">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground mb-8">You May Also Like</h2>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}
