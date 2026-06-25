import type { Metadata } from "next"
import { CustomOrderForm } from "@/components/custom-order/custom-order-form"
import { CustomOrderProcess } from "@/components/custom-order/custom-order-process"
import { CustomOrderFAQ } from "@/components/custom-order/custom-order-faq"

export const metadata: Metadata = {
  title: "Custom Order | Preserved Piece",
  description:
    "Create your bespoke resin jewelry piece. Transform your precious memories, flowers, and keepsakes into wearable art.",
}

export default function CustomOrderPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-secondary/30 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-primary font-medium mb-4">Bespoke Creations</p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-light text-foreground text-balance">
            Create Your <span className="italic">Custom Piece</span>
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Transform your cherished memories into timeless jewelry. From wedding bouquets to heirloom flowers, we
            preserve your precious moments in crystal-clear resin.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <CustomOrderProcess />

      {/* Custom Order Form */}
      <section className="py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="font-serif text-2xl sm:text-3xl font-light text-foreground">Start Your Custom Order</h2>
              <p className="mt-2 text-muted-foreground">
                Fill out the form below and we'll get back to you within 24 hours
              </p>
            </div>
            <CustomOrderForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <CustomOrderFAQ />
    </div>
  )
}
