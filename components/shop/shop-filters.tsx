"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  description: string
}

interface ShopFiltersProps {
  categories: Category[]
}

export function ShopFilters({ categories }: ShopFiltersProps) {
  const searchParams = useSearchParams()
  const activeCategory = searchParams.get("category")

  return (
    <div className="space-y-6 lg:space-y-8">
      <div>
        <h3 className="font-serif text-lg font-medium text-foreground mb-3 lg:mb-4">Categories</h3>
        <ul className="flex overflow-x-auto gap-4 lg:flex-col lg:gap-0 lg:space-y-2 pb-2 lg:pb-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <li className="shrink-0">
            <Link
              href="/shop"
              className={cn(
                "block py-2 px-1 text-sm transition-colors whitespace-nowrap",
                !activeCategory 
                  ? "text-primary font-medium border-b-2 border-primary lg:border-b-0 lg:border-none lg:px-0" 
                  : "text-muted-foreground hover:text-foreground lg:px-0",
              )}
            >
              All Products
            </Link>
          </li>
          {categories.map((category) => (
            <li key={category.id} className="shrink-0">
              <Link
                href={`/shop?category=${category.name}`}
                className={cn(
                  "block py-2 px-1 text-sm transition-colors whitespace-nowrap",
                  activeCategory === category.name
                    ? "text-primary font-medium border-b-2 border-primary lg:border-b-0 lg:border-none lg:px-0"
                    : "text-muted-foreground hover:text-foreground lg:px-0",
                )}
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="border-t border-border pt-6 lg:pt-8 hidden lg:block">
        <h3 className="font-serif text-lg font-medium text-foreground mb-4">Availability</h3>
        <ul className="space-y-2">
          <li>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded border-border" defaultChecked />
              <span className="text-sm text-muted-foreground">In Stock</span>
            </label>
          </li>
          <li>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" className="rounded border-border" />
              <span className="text-sm text-muted-foreground">Customizable</span>
            </label>
          </li>
        </ul>
      </div>
    </div>
  )
}
