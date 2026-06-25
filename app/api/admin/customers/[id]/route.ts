import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

async function isAdmin() {
  const session = await auth()
  return session?.user?.role === "admin"
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        addresses: true,
        orders: {
          include: {
            items: { include: { product: { select: { name: true, image: true } } } }
          },
          orderBy: { createdAt: 'desc' }
        },
        wishlist: {
          include: {
            product: { select: { id: true, name: true, price: true, image: true, inStock: true } }
          }
        }
      }
    })

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 })

    return NextResponse.json(user)
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch customer details" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { id } = await params
    const { loyaltyPoints, role } = await req.json()

    const updateData: any = {}
    if (loyaltyPoints !== undefined) updateData.loyaltyPoints = Number(loyaltyPoints)
    if (role) updateData.role = role

    const updated = await prisma.user.update({
      where: { id },
      data: updateData
    })

    return NextResponse.json(updated)
  } catch (err) {
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 })
  }
}
