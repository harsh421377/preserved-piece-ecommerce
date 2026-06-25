import type { Metadata } from "next"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { categories } from "@/lib/products"

export const metadata: Metadata = {
  title: "Collections | Preserved Piece",
  description: "Explore our curated collections of handcrafted resin jewelry and art pieces.",
}

export default function CollectionsPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Explore</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground">Our Collections</h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Discover our carefully curated categories, each featuring unique handcrafted pieces
          </p>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.filter(c => c.id !== "custom").map((category, index) => (
              <Link
                key={category.id}
                href={`/collections/${category.id}`}
                className={`group overflow-hidden rounded-xl block h-full ${
                  index === 0 ? "md:col-span-2" : 
                  index === 3 ? "md:col-span-2" : 
                  index === 4 ? "md:col-span-2 lg:col-span-3" :
                  ""
                }`}
              >
                <div className={`relative w-full h-full aspect-square ${
                  index === 0 || index === 3 ? "md:aspect-[2/1]" : 
                  index === 4 ? "md:aspect-[2/1] lg:aspect-[3/1]" :
                  ""
                }`}>
                  <Image
                    src={category.image || `/placeholder.svg?height=600&width=800&query=${category.name} resin jewelry elegant collection display`}
                    alt={category.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/30 group-hover:bg-foreground/40 transition-colors" />
                  <div className="absolute inset-0 flex flex-col justify-end p-8 lg:p-12 text-background">
                    <h2 className="font-serif text-3xl sm:text-4xl font-medium">{category.name}</h2>
                    <p className="mt-2 text-background/80 max-w-md">{category.description}</p>
                    <div className="mt-4 flex items-center gap-2 text-sm font-medium">
                      <span>View Collection</span>
                      <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
