import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { auth, isAdmin } from "@/lib/auth"

const ProductSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be > 0"),
  originalPrice: z.number().positive().optional(),
  categoryId: z.string().min(1, "Category is required"),
  image: z.string().min(1, "Image URL is required"),
  images: z.array(z.string()).optional(),
  customizable: z.boolean().default(false),
  inStock: z.boolean().default(true),
  featured: z.boolean().default(false),
  stockQuantity: z.number().int().min(0).default(10),
})

// GET /api/products - list all products with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const category = searchParams.get("category")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")
    const page = parseInt(searchParams.get("page") ?? "1")
    const limit = parseInt(searchParams.get("limit") ?? "50")

    const where: Record<string, unknown> = {}
    if (category) where.category = { name: category }
    if (featured === "true") where.featured = true
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
        { category: { name: { contains: search } } },
      ]
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        include: { category: true, images: true, details: true },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({ where }),
    ])

    return NextResponse.json({ products, total, page, limit })
  } catch (error) {
    console.error("[GET /api/products]", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

// POST /api/products - create product (admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const data = ProductSchema.parse(body)

    const { images, ...productData } = data

    const product = await prisma.product.create({
      data: {
        ...productData,
        images: images && images.length > 0 ? {
          create: images.map((url) => ({ url })),
        } : undefined,
      },
      include: { category: true, images: true },
    })

    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    console.error("[POST /api/products]", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
