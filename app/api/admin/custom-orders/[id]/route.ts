import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const UpdateSchema = z.object({
  status: z.enum(["PENDING", "COMPLETED", "REJECTED"])
})

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { id } = await params
    const body = await request.json()
    const data = UpdateSchema.parse(body)

    const updated = await prisma.customOrderRequest.update({
      where: { id },
      data: { status: data.status }
    })

    return NextResponse.json(updated)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update custom order status" }, { status: 500 })
  }
}
