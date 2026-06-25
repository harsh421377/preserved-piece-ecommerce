import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth, isAdmin } from "@/lib/auth"

const GalleryImageSchema = z.object({
  url: z.string().min(1, "URL is required"),
  caption: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  likes: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
})

export async function GET() {
  try {
    const images = await prisma.galleryImage.findMany({
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(images)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery images" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json()
    const data = GalleryImageSchema.parse(body)
    
    const image = await prisma.galleryImage.create({
      data: {
        url: data.url,
        caption: data.caption,
        category: data.category,
        likes: data.likes,
        featured: data.featured,
      }
    })
    
    return NextResponse.json(image, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to create gallery image" }, { status: 500 })
  }
}
