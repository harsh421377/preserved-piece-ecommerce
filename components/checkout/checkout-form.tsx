"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  CreditCard,
  Smartphone,
  Wallet,
  Truck,
  Shield,
  ChevronLeft,
  Loader2,
  Check,
  Gift,
  MessageCircle,
} from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useCart } from "@/lib/cart-context"
import { formatPrice, cn } from "@/lib/utils"

const paymentMethods = [
  { id: "razorpay", name: "Pay Online", description: "UPI, Cards, Wallets, NetBanking", icon: Smartphone },
  { id: "cod", name: "Cash on Delivery", description: "+₹50 COD charges", icon: Truck },
]

export function CheckoutForm() {
  const { items, totalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState("razorpay")
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [couponData, setCouponData] = useState<{code: string, discountType: string, discountValue: number} | null>(null)
  const [couponError, setCouponError] = useState("")

  // Account Integration States
  const [addresses, setAddresses] = useState<any[]>([])
  const [loyaltyData, setLoyaltyData] = useState({ points: 0, expired: false })
  const [usePoints, setUsePoints] = useState(false)
  const [selectedAddressId, setSelectedAddressId] = useState<string>("new")

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", pincode: "", notes: "", isGift: false,
  })

  useEffect(() => {
    Promise.all([
      fetch("/api/user/address").then(res => res.ok ? res.json() : []),
      fetch("/api/user/profile").then(res => res.ok ? res.json() : null)
    ]).then(([addrList, prof]) => {
      if (Array.isArray(addrList) && addrList.length > 0) {
        setAddresses(addrList)
        const def = addrList.find((a:any) => a.isDefaultShipping) || addrList[0]
        handleSelectAddress(def)
      }
      if (prof) {
        setFormData(prev => ({ ...prev, email: prev.email || prof.email || "" }))
        if (prof.loyaltyPoints) {
           let pts = prof.loyaltyPoints
           let expired = false
           if (prof.pointsExpiryDate && new Date() > new Date(prof.pointsExpiryDate)) {
             pts = 0; expired = true;
           }
           setLoyaltyData({ points: pts, expired })
        }
      }
    })
  }, [])

  const handleSelectAddress = (addr: any) => {
    setSelectedAddressId(addr.id || "new")
    if (addr.id) {
      setFormData(prev => ({
        ...prev,
        firstName: addr.firstName || "",
        lastName: addr.lastName || "",
        phone: addr.phone || "",
        address: addr.addressLine1 + (addr.addressLine2 ? ` ${addr.addressLine2}` : ""),
        city: addr.city || "",
        state: addr.state || "",
        pincode: addr.pincode || ""
      }))
    } else {
      setFormData(prev => ({ ...prev, address: "", city: "", state: "", pincode: "" }))
    }
  }

  const shippingCost = totalPrice >= 2500 ? 0 : 99
  const codCharges = paymentMethod === "cod" ? 50 : 0
  const giftCharges = formData.isGift ? 50 : 0
  
  const couponDiscount = couponData 
    ? (couponData.discountType === "PERCENTAGE" 
        ? Math.round(totalPrice * (couponData.discountValue / 100))
        : couponData.discountValue)
    : 0
  const subTotalAfterCoupon = Math.max(0, totalPrice - couponDiscount)
  
  const pointsToRedeem = usePoints ? Math.min(loyaltyData.points, subTotalAfterCoupon * 10) : 0
  const pointsDiscount = pointsToRedeem / 10
  
  const discount = couponDiscount + pointsDiscount
  const finalTotal = totalPrice + shippingCost + codCharges + giftCharges - discount

  const handleApplyCoupon = async () => {
    setCouponError("")
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, cartTotal: totalPrice })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setCouponData(data.coupon)
        setCouponApplied(true)
        toast.success(`Coupon ${data.coupon.code} applied!`)
      } else {
        setCouponError(data.error || "Invalid coupon")
        toast.error(data.error || "Invalid coupon")
      }
    } catch {
      setCouponError("Failed to validate coupon")
    }
  }

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if ((window as any).Razorpay) return resolve(true)
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const completeOrderSubmit = async (razorpayData: any = {}) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          paymentMethod,
          subtotal: totalPrice,
          discount,
          shippingCost,
          codCharges,
          giftCharges,
          total: finalTotal,
          pointsRedeemed: pointsToRedeem,
          couponCode: couponData?.code,
          items: items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            price: item.price,
          })),
          ...razorpayData
        }),
      })
      if (res.ok) {
        setIsComplete(true)
        clearCart()
      } else {
        const err = await res.json()
        if (err.details && err.details.length > 0) {
           toast.error(`Validation Error: ${err.details[0].path[0]} - ${err.details[0].message}`)
        } else {
           toast.error(err.error || "Order creation failed")
        }
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step < 3) {
      setStep(step + 1)
      return
    }

    setIsProcessing(true)

    if (paymentMethod === "razorpay") {
      const resLoad = await loadRazorpay()
      if (!resLoad) {
         toast.error("Razorpay SDK failed to load!")
         setIsProcessing(false)
         return
      }

      try {
        const orderData = await fetch("/api/razorpay", {
           method: "POST", body: JSON.stringify({ amount: finalTotal })
        }).then(r => r.json())

        if (!orderData || !orderData.id) {
           toast.error(orderData.error || "Failed to initialize payment gateway")
           setIsProcessing(false)
           return
        }

        if (orderData.isMock) {
          toast.success("Running in Sandbox Mock Payment Mode...")
          setTimeout(async () => {
             await completeOrderSubmit({
                razorpayPaymentId: `mock_pay_${Date.now()}`,
                razorpayOrderId: orderData.id,
                razorpaySignature: "mock_sig_123456",
             })
          }, 1500)
          return
        }

        const options = {
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Preserved Piece",
          description: "Order Checkout",
          order_id: orderData.id,
          handler: async function (response: any) {
             await completeOrderSubmit({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
             })
          },
          prefill: {
            name: formData.firstName + " " + formData.lastName,
            email: formData.email,
            contact: formData.phone
          },
          theme: { color: "#e11d48" },
          modal: {
            ondismiss: function () {
              setIsProcessing(false)
            }
          }
        }
        
        const paymentObject = new (window as any).Razorpay(options)
        paymentObject.on("payment.failed", function(response: any) {
           toast.error(response.error?.description || "Payment failed!")
           setIsProcessing(false)
        })
        paymentObject.open()
      } catch (err) {
        toast.error("Something went wrong with the payment gateway.")
        setIsProcessing(false)
      }
    } else {
      await completeOrderSubmit()
    }
  }

  if (items.length === 0 && !isComplete) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 lg:p-12 text-center">
        <h2 className="font-serif text-2xl font-medium text-foreground mb-4">Your Cart is Empty</h2>
        <p className="text-muted-foreground mb-6">Add some beautiful pieces to your cart before checking out.</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  if (isComplete) {
    return (
      <div className="bg-card rounded-2xl border border-border p-8 lg:p-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 text-green-600 mb-6">
          <Check className="h-10 w-10" />
        </div>
        <h2 className="font-serif text-3xl font-medium text-foreground mb-2">Order Placed Successfully!</h2>
        <p className="text-muted-foreground mb-6">
          Thank you for your order. We've sent a confirmation email with your order details.
        </p>
        <div className="bg-secondary/50 rounded-lg p-4 mb-6 text-left">
          <p className="text-sm font-medium text-foreground">Order Number: #PP{Date.now().toString().slice(-8)}</p>
          <p className="text-sm text-muted-foreground mt-1">Estimated delivery: 5-7 business days</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
          <Button asChild variant="outline">
            <a href="https://wa.me/919999999999" target="_blank" rel="noopener noreferrer">
              <MessageCircle className="mr-2 h-4 w-4" />
              Track on WhatsApp
            </a>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    step >= s ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground",
                  )}
                >
                  {step > s ? <Check className="h-4 w-4" /> : s}
                </div>
                <span
                  className={cn("text-sm hidden sm:block", step >= s ? "text-foreground" : "text-muted-foreground")}
                >
                  {s === 1 ? "Shipping" : s === 2 ? "Review" : "Payment"}
                </span>
                {s < 3 && <div className="w-8 lg:w-16 h-px bg-border" />}
              </div>
            ))}
          </div>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 space-y-6">
              <h2 className="font-serif text-xl font-medium text-foreground">Shipping Information</h2>

              {addresses.length > 0 && (
                <div className="space-y-4 mb-8">
                  <Label>Saved Addresses</Label>
                  <div className="grid sm:grid-cols-2 gap-3 mt-2">
                    {addresses.map(addr => (
                      <div 
                        key={addr.id} 
                        onClick={() => handleSelectAddress(addr)}
                        className={cn(
                          "border rounded-xl p-4 cursor-pointer transition-all",
                          selectedAddressId === addr.id ? "border-rose-500 bg-rose-50" : "border-border hover:border-rose-300"
                        )}
                      >
                        <p className="font-bold text-sm">{addr.firstName} {addr.lastName}</p>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {addr.addressLine1}, {addr.city}, {addr.state} {addr.pincode}
                        </p>
                      </div>
                    ))}
                    <div 
                        onClick={() => handleSelectAddress({ id: "new" })}
                        className={cn(
                          "border rounded-xl p-4 cursor-pointer transition-all flex items-center justify-center font-bold text-sm",
                          selectedAddressId === "new" ? "border-rose-500 bg-rose-50 text-rose-600" : "border-dashed border-border hover:border-rose-300"
                        )}
                      >
                        + Add New Address
                      </div>
                  </div>
                  <div className="w-full h-px bg-border/50 my-6" />
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name *</Label>
                  <Input id="firstName" required placeholder="Enter first name" value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name *</Label>
                  <Input id="lastName" required placeholder="Enter last name" value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="bg-background" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required placeholder="your@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" type="tel" required placeholder="+91 99999 99999" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="bg-background" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address *</Label>
                <Input id="address" required placeholder="House/Flat No., Street Name" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="bg-background" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input id="city" required placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <Input id="state" required placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="bg-background" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code *</Label>
                  <Input id="pincode" required placeholder="PIN Code" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="bg-background" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Any special instructions for delivery..."
                  value={formData.notes}
                  onChange={e => setFormData({...formData, notes: e.target.value})}
                  className="bg-background resize-none"
                  rows={3}
                />
              </div>

              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isGift} onChange={e => setFormData({...formData, isGift: e.target.checked})} className="rounded border-border" />
                <span className="text-sm text-muted-foreground">
                  <Gift className="inline h-4 w-4 mr-1" />
                  This is a gift - include gift wrapping (+₹50)
                </span>
              </label>
            </div>
          )}

          {/* Step 2: Review Order */}
          {step === 2 && (
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 space-y-6">
              <h2 className="font-serif text-xl font-medium text-foreground">Review Your Order</h2>

              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="relative h-20 w-20 rounded-lg overflow-hidden bg-secondary shrink-0">
                      <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-foreground">{item.name}</h4>
                      <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      <p className="text-sm font-medium text-primary">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4">
                <h3 className="font-medium text-foreground mb-2">Shipping Information</h3>
                <p className="text-sm text-muted-foreground">
                  <strong>Name:</strong> {formData.firstName} {formData.lastName || ""}
                  <br />
                  <strong>Phone:</strong> {formData.phone}
                  <br />
                  <strong>Email:</strong> {formData.email}
                  <br />
                  <strong>Address:</strong> {formData.address}, {formData.city}, {formData.state} {formData.pincode}
                </p>
              </div>
            </div>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <div className="bg-card rounded-2xl border border-border p-6 lg:p-8 space-y-6">
              <h2 className="font-serif text-xl font-medium text-foreground">Payment Method</h2>

              {/* Loyalty Points Wallet */}
              {loyaltyData.points > 0 && (
                 <div className="mb-2 p-5 bg-gradient-to-r from-rose-50 to-purple-50 border border-purple-100 rounded-xl flex items-center justify-between shadow-sm">
                   <div>
                     <p className="font-bold text-purple-900 text-sm">Loyalty Points Wallet</p>
                     <p className="text-xs text-purple-700/80 mt-1">Balance: {loyaltyData.points} points. Redeems for ₹{loyaltyData.points / 10} off.</p>
                   </div>
                   <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-lg border border-purple-100 shadow-sm hover:bg-purple-50 transition-colors">
                     <input 
                       type="checkbox" 
                       checked={usePoints} 
                       onChange={e => setUsePoints(e.target.checked)} 
                       className="rounded border-purple-300 text-purple-600 focus:ring-purple-600 w-4 h-4 cursor-pointer" 
                     />
                     <span className="text-sm font-bold text-purple-700">Apply</span>
                   </label>
                 </div>
              )}
              {loyaltyData.expired && <p className="text-xs text-orange-500 mb-6 px-1">Some of your past loyalty points have expired.</p>}

              <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="space-y-3">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-lg border cursor-pointer transition-colors",
                      paymentMethod === method.id
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50",
                    )}
                  >
                    <RadioGroupItem value={method.id} />
                    <method.icon className="h-6 w-6 text-foreground" />
                    <div className="flex-1">
                      <p className="font-medium text-foreground">{method.name}</p>
                      <p className="text-sm text-muted-foreground">{method.description}</p>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <label className="flex items-start gap-3 cursor-pointer pt-4 border-t border-border mt-6">
                <input type="checkbox" required className="rounded border-border mt-1 shrink-0" />
                <span className="text-sm text-muted-foreground">
                  I agree to the{" "}
                  <Link href="/policies/terms" className="text-primary hover:underline">
                    Terms & Conditions
                  </Link>{" "}
                  and{" "}
                  <Link href="/policies/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <div className="flex items-center gap-2 text-sm text-muted-foreground pt-4">
                <Shield className="h-4 w-4" />
                <span>Tested and secured with 256-bit encryption by Razorpay</span>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4">
            {step > 1 && (
              <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                <ChevronLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
            )}
            <Button type="submit" className="flex-1" disabled={isProcessing}>
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : step === 3 ? (
                `Pay ${formatPrice(finalTotal)}`
              ) : (
                "Continue"
              )}
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-card rounded-2xl border border-border p-6 sticky top-24">
            <h2 className="font-serif text-xl font-medium text-foreground mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="relative h-16 w-16 rounded-lg overflow-hidden bg-secondary shrink-0">
                    <Image src={item.image || "/placeholder.svg"} alt={item.name} fill className="object-cover" />
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-foreground text-background text-xs rounded-full flex items-center justify-center">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-foreground truncate">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{formatPrice(item.price)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon */}
            <div className="flex gap-2 mb-6">
              <Input
                placeholder="Coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="bg-background"
                disabled={couponApplied}
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleApplyCoupon}
                disabled={couponApplied || !couponCode}
              >
                {couponApplied ? <Check className="h-4 w-4" /> : "Apply"}
              </Button>
            </div>

            {couponData && <p className="text-sm text-green-600 mb-4">Coupon {couponData.code} applied! {couponData.discountType === 'PERCENTAGE' ? `${couponData.discountValue}%` : `₹${couponData.discountValue}`} discount</p>}
            {couponError && <p className="text-sm text-rose-600 mb-4">{couponError}</p>}

            <div className="space-y-3 pt-4 border-t border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="text-foreground">{formatPrice(totalPrice)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-green-600">Discount ({couponData?.code})</span>
                  <span className="text-green-600">-{formatPrice(couponDiscount)}</span>
                </div>
              )}
              {pointsDiscount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-purple-600">Points Redeemed ({pointsToRedeem} pts)</span>
                  <span className="text-purple-600 font-medium">- {formatPrice(pointsDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="text-foreground">{shippingCost === 0 ? "Free" : formatPrice(shippingCost)}</span>
              </div>
              {codCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">COD Charges</span>
                  <span className="text-foreground">{formatPrice(codCharges)}</span>
                </div>
              )}
              {giftCharges > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Gift Wrapping</span>
                  <span className="text-foreground">{formatPrice(giftCharges)}</span>
                </div>
              )}
              <div className="flex justify-between pt-3 border-t border-border">
                <span className="font-medium text-foreground">Total</span>
                <span className="font-semibold text-lg text-foreground">{formatPrice(finalTotal)}</span>
              </div>
            </div>

            {totalPrice < 2500 && (
              <p className="text-xs text-muted-foreground mt-4 text-center">
                Add {formatPrice(2500 - totalPrice)} more for free shipping!
              </p>
            )}

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-border">
              <div className="text-center">
                <Shield className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Secure</p>
              </div>
              <div className="text-center">
                <Truck className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Fast Delivery</p>
              </div>
              <div className="text-center">
                <Gift className="h-5 w-5 mx-auto text-primary mb-1" />
                <p className="text-xs text-muted-foreground">Gift Wrap</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}
