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
    const { id } = await params
    const body = await request.json()

    // We expect { read: boolean }
    if (typeof body.read !== "boolean") {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
    }

    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { read: body.read },
    })

    return NextResponse.json(updatedMessage)
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message" }, { status: 500 })
  }
}
