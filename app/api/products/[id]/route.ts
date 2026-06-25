import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth, isAdmin } from "@/lib/auth"

const UpdateSchema = z.object({
  name: z.string().min(1, "Name is required").optional(),
  description: z.string().min(1, "Description is required").optional(),
  price: z.number().positive("Price must be > 0").optional(),
  originalPrice: z.number().positive().optional().nullable(),
  categoryId: z.string().min(1, "Category is required").optional(),
  image: z.string().min(1, "Image URL is required").optional(),
  images: z.array(z.string()).optional(),
  customizable: z.boolean().optional(),
  inStock: z.boolean().optional(),
  featured: z.boolean().optional(),
  stockQuantity: z.number().int().min(0).optional(),
})

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const product = await prisma.product.findUnique({
      where: { id },
      include: { category: true, images: true, details: true },
    })
    if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
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
    const data = UpdateSchema.parse(body)
    const { images, ...productData } = data

    const product = await prisma.product.update({ 
      where: { id }, 
      data: {
        ...productData,
        images: images ? {
          deleteMany: {},
          create: images.map((url) => ({ url }))
        } : undefined
      }, 
      include: { category: true, images: true } 
    })
    return NextResponse.json(product)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    const { id } = await params
    await prisma.product.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 })
  }
}
