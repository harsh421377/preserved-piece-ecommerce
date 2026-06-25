import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const { code, cartTotal } = await request.json()

    if (!code) {
      return NextResponse.json({ error: "Coupon code is required" }, { status: 400 })
    }

    const coupon = await prisma.coupon.findUnique({
      where: { code: code.toUpperCase() }
    })

    if (!coupon) {
      return NextResponse.json({ error: "Invalid coupon code" }, { status: 404 })
    }

    if (!coupon.isActive) {
      return NextResponse.json({ error: "This coupon is no longer active" }, { status: 400 })
    }

    if (coupon.expiryDate && new Date() > new Date(coupon.expiryDate)) {
      return NextResponse.json({ error: "This coupon has expired" }, { status: 400 })
    }

    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return NextResponse.json({ error: "This coupon has reached its usage limit" }, { status: 400 })
    }

    if (coupon.minSpend && cartTotal < coupon.minSpend) {
      return NextResponse.json({ 
        error: `Minimum spend of ₹${coupon.minSpend} required for this coupon` 
      }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
      }
    })
  } catch (error) {
    console.error("Coupon validation error:", error)
    return NextResponse.json({ error: "Failed to validate coupon" }, { status: 500 })
  }
}
