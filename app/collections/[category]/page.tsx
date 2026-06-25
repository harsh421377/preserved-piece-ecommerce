import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { categories, getProductsByCategory } from "@/lib/products"
import { ProductCard } from "@/components/product-card"

interface CategoryPageProps {
  params: Promise<{ category: string }>
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params
  const categoryData = categories.find((c) => c.id === category)

  if (!categoryData) {
    return { title: "Category Not Found | Preserved Piece" }
  }

  return {
    title: `${categoryData.name} | Preserved Piece`,
    description: categoryData.description,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params
  const categoryData = categories.find((c) => c.id === category)

  if (!categoryData) {
    notFound()
  }

  const products = getProductsByCategory(category)

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Collection</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">
            {categoryData.name}
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">{categoryData.description}</p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {products.length > 0 ? (
            <>
              <p className="text-sm text-muted-foreground mb-8">{products.length} products</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No products in this collection yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
