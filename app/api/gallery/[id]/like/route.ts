import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"

export async function POST(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id: galleryImageId } = await params
    const userId = session.user.id

    // Check if user has already liked the image
    const existingLike = await prisma.galleryImageLike.findUnique({
      where: {
        userId_galleryImageId: {
          userId,
          galleryImageId,
        },
      },
    })

    let updatedImage
    let hasLiked = false

    if (existingLike) {
      // Unlike: Delete relationship, decrement counter
      await prisma.galleryImageLike.delete({
        where: {
          userId_galleryImageId: {
            userId,
            galleryImageId,
          },
        },
      })

      updatedImage = await prisma.galleryImage.update({
        where: { id: galleryImageId },
        data: {
          likes: { decrement: 1 },
        },
      })
      hasLiked = false
    } else {
      // Like: Create relationship, increment counter
      await prisma.galleryImageLike.create({
        data: {
          userId,
          galleryImageId,
        },
      })

      updatedImage = await prisma.galleryImage.update({
        where: { id: galleryImageId },
        data: {
          likes: { increment: 1 },
        },
      })
      hasLiked = true
    }

    return NextResponse.json({ success: true, likes: updatedImage.likes, hasLiked })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to process like toggle" }, { status: 500 })
  }
}
