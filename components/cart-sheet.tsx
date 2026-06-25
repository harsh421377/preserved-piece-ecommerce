"use client"

import Image from "next/image"
import Link from "next/link"
import { Minus, Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { useSession } from "next-auth/react"
import { useCart } from "@/lib/cart-context"
import { formatPrice } from "@/lib/utils"
import { useRouter } from "next/navigation"

export function CartSheet() {
  const { items, isCartOpen, setIsCartOpen, removeItem, updateQuantity, totalPrice } = useCart()
  const { data: session } = useSession()
  const router = useRouter()

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-lg bg-background">
        <SheetHeader>
          <SheetTitle className="font-serif text-2xl">Your Cart</SheetTitle>
          <SheetDescription className="sr-only">Review and manage items in your shopping cart</SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[60vh] text-center">
            <p className="text-muted-foreground mb-4">Your cart is empty</p>
            <Button asChild onClick={() => setIsCartOpen(false)}>
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto py-6">
              <ul className="space-y-6">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4">
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground truncate">{item.name}</h4>
                      {item.customization && <p className="text-sm text-muted-foreground mt-1">{item.customization}</p>}
                      <p className="text-sm font-medium text-primary mt-1">{formatPrice(item.price)}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 bg-transparent"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-foreground shrink-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border pt-6 pb-20 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Total</span>
                <span className="text-lg font-semibold text-primary">{formatPrice(totalPrice)}</span>
              </div>
              <Button asChild className="w-full" size="lg">
                <Link
                  href={session ? "/checkout" : "/login?callbackUrl=/checkout"}
                  onClick={() => setIsCartOpen(false)}
                >
                  {session ? "Proceed to Checkout" : "Sign In to Checkout"}
                </Link>
              </Button>
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setIsCartOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}
