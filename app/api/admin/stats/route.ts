import { NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const now = new Date()
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate())

    const [
      totalOrders,
      pendingOrders,
      totalProducts,
      totalMessages,
      revenueAgg,
      todayOrdersAgg,
      recentOrders,
      orderStatusGroups,
      totalCustomOrders,
      pendingCustomOrders,
    ] = await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.product.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELLED" } } }),
      prisma.order.count({ where: { createdAt: { gte: todayStart } } }),
      prisma.order.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { items: { include: { product: true } } },
      }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { status: true }
      }),
      prisma.customOrderRequest.count(),
      prisma.customOrderRequest.count({ where: { status: "PENDING" } }),
    ])

    return NextResponse.json({
      totalOrders,
      pendingOrders,
      totalProducts,
      unreadMessages: totalMessages,
      totalRevenue: revenueAgg._sum.total ?? 0,
      todayOrders: todayOrdersAgg,
      recentOrders,
      totalCustomOrders,
      pendingCustomOrders,
      orderStatusDistribution: orderStatusGroups.map(g => ({
        name: g.status,
        value: g._count.status
      }))
    })
  } catch {
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 })
  }
}
