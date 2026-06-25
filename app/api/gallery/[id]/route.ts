import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth, isAdmin } from "@/lib/auth"

const UpdateGallerySchema = z.object({
  url: z.string().min(1).optional(),
  caption: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  likes: z.number().int().min(0).optional(),
  featured: z.boolean().optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const image = await prisma.galleryImage.findUnique({ where: { id } })
    if (!image) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(image)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch gallery image" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    const body = await request.json()
    const data = UpdateGallerySchema.parse(body)
    
    const image = await prisma.galleryImage.update({
      where: { id },
      data,
    })
    return NextResponse.json(image)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update gallery image" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    await prisma.galleryImage.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete gallery image" }, { status: 500 })
  }
}
