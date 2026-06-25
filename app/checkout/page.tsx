import type { Metadata } from "next"
import { CheckoutForm } from "@/components/checkout/checkout-form"

export const metadata: Metadata = {
  title: "Checkout | Preserved Piece",
  description: "Complete your order securely. Free shipping on orders above ₹2,500.",
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="mb-8">
          <h1 className="font-serif text-3xl sm:text-4xl font-light text-foreground">Checkout</h1>
          <p className="mt-2 text-muted-foreground">Complete your order securely</p>
        </div>

        <CheckoutForm />
      </div>
    </div>
  )
}
