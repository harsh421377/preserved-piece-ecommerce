import Link from "next/link"
import type React from "react"

const policyLinks = [
  { name: "Shipping Policy", href: "/policies/shipping" },
  { name: "Return & Refund", href: "/policies/returns" },
  { name: "Custom Order Policy", href: "/policies/custom-orders" },
  { name: "Privacy Policy", href: "/policies/privacy" },
  { name: "Terms & Conditions", href: "/policies/terms" },
]

export default function PoliciesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-12 lg:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground">Policies</h1>
          <p className="mt-2 text-muted-foreground">Everything you need to know about our terms and policies</p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          {/* Sidebar Navigation */}
          <aside className="lg:w-64 shrink-0">
            <nav className="sticky top-24 space-y-1">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block py-2 px-3 text-sm text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 prose prose-stone max-w-none prose-headings:font-serif prose-headings:font-medium prose-h1:text-3xl prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4 prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-foreground">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
