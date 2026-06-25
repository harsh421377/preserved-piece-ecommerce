import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const coupons = await prisma.coupon.findMany({
      orderBy: { createdAt: "desc" }
    })
    return NextResponse.json({ coupons })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch coupons" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const body = await request.json()
    const { code, discountType, discountValue, minSpend, expiryDate, usageLimit, isActive } = body

    if (!code || !discountType || !discountValue) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } })
    if (existing) {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 400 })
    }

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        discountType,
        discountValue: parseFloat(discountValue),
        minSpend: minSpend ? parseFloat(minSpend) : null,
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        usageLimit: usageLimit ? parseInt(usageLimit) : null,
        isActive: isActive !== undefined ? isActive : true,
      }
    })

    return NextResponse.json(coupon, { status: 201 })
  } catch (error) {
    console.error("Failed to create coupon:", error)
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 })
  }
}
