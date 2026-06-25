import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

const StatusSchema = z.object({
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "RETURNED"]),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const order = await prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const session = await auth()
    if (order.userId) {
      if (!session || (!isAdmin(session) && session.user.id !== order.userId)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
    }

    return NextResponse.json(order)
  } catch {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const { id } = await params
    const body = await request.json()
    const { status } = StatusSchema.parse(body)
    const order = await prisma.order.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(order)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update order" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()
    const { action, reason } = body
    
    const order = await prisma.order.findUnique({ where: { id } })
    if (!order) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const session = await auth()
    if (!session || (!isAdmin(session) && session.user.id !== order.userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (action === "cancel") {
      if (order.status !== "PENDING" && order.status !== "PROCESSING") {
        return NextResponse.json({ error: "Cannot cancel at this stage." }, { status: 400 })
      }
      const updated = await prisma.order.update({
        where: { id },
        data: { status: "CANCELLED" }
      })
      return NextResponse.json(updated)
    }

    if (action === "return") {
      if (order.status !== "DELIVERED") {
        return NextResponse.json({ error: "Only delivered orders can be returned." }, { status: 400 })
      }
      const updated = await prisma.order.update({
        where: { id },
        data: { 
          returnReason: reason || "User requested",
          returnStatus: "REQUESTED"
        }
      })
      return NextResponse.json(updated)
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 })
  }
}
