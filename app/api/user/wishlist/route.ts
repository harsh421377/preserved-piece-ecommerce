import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  const wishlist = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: {
      product: {
        select: {
          id: true,
          name: true,
          price: true,
          image: true,
          originalPrice: true,
          customizable: true,
          inStock: true,
        }
      }
    },
    orderBy: { createdAt: 'desc' }
  })
  
  return Response.json(wishlist)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  try {
    const { productId } = await req.json()
    if (!productId) return new Response("Missing productId", { status: 400 })

    const existing = await prisma.wishlistItem.findUnique({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    })

    if (existing) {
      await prisma.wishlistItem.delete({
        where: { id: existing.id }
      })
      return Response.json({ action: "removed", productId })
    }

    const item = await prisma.wishlistItem.create({
      data: {
        userId: session.user.id,
        productId
      }
    })
    
    return Response.json({ action: "added", item })
  } catch (err: any) {
    return Response.json({ error: "Failed to update wishlist" }, { status: 500 })
  }
}

// DELETE is generally handled by POST toggle, but we provide it for completeness
export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const productId = searchParams.get("productId")
    if (!productId) return new Response("Missing productId", { status: 400 })

    await prisma.wishlistItem.delete({
      where: {
        userId_productId: {
          userId: session.user.id,
          productId
        }
      }
    })
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Failed to delete wishlist item" }, { status: 500 })
  }
}
