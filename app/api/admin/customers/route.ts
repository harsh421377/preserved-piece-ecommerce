import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// Function to check if user is admin
async function isAdmin() {
  const session = await auth()
  return session?.user?.role === "admin"
}

export async function GET(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const { searchParams } = new URL(req.url)
    const page = parseInt(searchParams.get("page") || "1")
    const limit = parseInt(searchParams.get("limit") || "15")
    const search = searchParams.get("search") || ""
    const skip = (page - 1) * limit

    const whereClause = search ? {
      OR: [
        { name: { contains: search } },
        { email: { contains: search } }
      ]
    } : {}

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          loyaltyPoints: true,
          createdAt: true,
          _count: {
            select: { orders: true }
          }
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.user.count({ where: whereClause })
    ])

    return NextResponse.json({ users, total })
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 })
  }
}
