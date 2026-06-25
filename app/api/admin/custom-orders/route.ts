import { NextRequest, NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get("status")
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "15")
    const skip = (page - 1) * limit

    const where = status && status !== "ALL" ? { status } : {}

    const [orders, total] = await Promise.all([
      prisma.customOrderRequest.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.customOrderRequest.count({ where })
    ])

    return NextResponse.json({ orders, total, page, limit })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch custom orders" }, { status: 500 })
  }
}
