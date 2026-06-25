import type { Metadata } from "next"
import Link from "next/link"
import { Truck, RotateCcw, Sparkles, Shield, ScrollText } from "lucide-react"

export const metadata: Metadata = {
  title: "Policies | Preserved Piece",
  description: "View all our policies including shipping, returns, custom orders, privacy, and terms.",
}

const policies = [
  {
    icon: Truck,
    title: "Shipping Policy",
    description: "Delivery times, shipping costs, and international shipping information",
    href: "/policies/shipping",
  },
  {
    icon: RotateCcw,
    title: "Return & Refund",
    description: "Our return process, refund timeline, and exchange policy",
    href: "/policies/returns",
  },
  {
    icon: Sparkles,
    title: "Custom Order Policy",
    description: "Everything about custom orders, materials, pricing, and timelines",
    href: "/policies/custom-orders",
  },
  {
    icon: Shield,
    title: "Privacy Policy",
    description: "How we collect, use, and protect your personal information",
    href: "/policies/privacy",
  },
  {
    icon: ScrollText,
    title: "Terms & Conditions",
    description: "Terms of use, intellectual property, and legal information",
    href: "/policies/terms",
  },
]

export default function PoliciesPage() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {policies.map((policy) => (
        <Link
          key={policy.href}
          href={policy.href}
          className="group bg-card rounded-xl border border-border p-6 hover:border-primary/50 hover:shadow-sm transition-all"
        >
          <policy.icon className="h-8 w-8 text-primary mb-4" />
          <h2 className="font-serif text-lg font-medium text-foreground group-hover:text-primary transition-colors">
            {policy.title}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">{policy.description}</p>
        </Link>
      ))}
    </div>
  )
}
