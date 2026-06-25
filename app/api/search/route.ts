import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const q = request.nextUrl.searchParams.get("q") ?? ""
    if (!q.trim()) return NextResponse.json({ results: [] })

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { description: { contains: q } },
          { category: { name: { contains: q } } },
        ],
      },
      include: { category: true },
      take: 10,
      orderBy: { featured: "desc" },
    })

    return NextResponse.json({ results: products })
  } catch {
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
