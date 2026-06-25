import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth, isAdmin } from "@/lib/auth"

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    await prisma.category.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const { name, description } = await request.json()
    const category = await prisma.category.update({ where: { id }, data: { name, description } })
    return NextResponse.json(category)
  } catch {
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 })
  }
}
