import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const val = await params;
    const { id } = val;

    const body = await request.json()
    const { isActive } = body

    const coupon = await prisma.coupon.update({
      where: { id },
      data: { isActive }
    })

    return NextResponse.json(coupon)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const val = await params;
    const { id } = val;

    await prisma.coupon.delete({ where: { id } })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 })
  }
}
