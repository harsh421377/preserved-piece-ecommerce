import { NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const messages = await prisma.contactMessage.findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
    })
    return NextResponse.json({ messages })
  } catch {
    return NextResponse.json({ error: "Failed to load messages" }, { status: 500 })
  }
}
