import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  try {
    const orders = await prisma.order.findMany({
      where: { userId: session.user.id },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, image: true }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return Response.json(orders)
  } catch (err) {
    return Response.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}
