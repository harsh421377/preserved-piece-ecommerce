import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const addressSchema = z.object({
  label: z.string().min(1).default("Home"),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().min(1),
  addressLine1: z.string().min(1),
  addressLine2: z.string().optional().nullable(),
  city: z.string().min(1),
  state: z.string().min(1),
  pincode: z.string().min(1),
  isDefaultShipping: z.boolean().default(false),
  isDefaultBilling: z.boolean().default(false),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  const addresses = await prisma.address.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: 'desc' }
  })
  
  return Response.json(addresses)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const data = addressSchema.parse(body)

    // If setting as default, unset others first
    if (data.isDefaultShipping) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefaultShipping: true },
        data: { isDefaultShipping: false }
      })
    }
    if (data.isDefaultBilling) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefaultBilling: true },
        data: { isDefaultBilling: false }
      })
    }

    const address = await prisma.address.create({
      data: { ...data, userId: session.user.id }
    })
    
    return Response.json(address)
  } catch (err: any) {
    if (err instanceof z.ZodError) return Response.json({ error: err.errors[0].message }, { status: 422 })
    return Response.json({ error: "Failed to create address" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  try {
    const body = await req.json()
    const { id, ...updateData } = body
    if (!id) return new Response("Missing address ID", { status: 400 })
    
    const data = addressSchema.partial().parse(updateData)

    if (data.isDefaultShipping) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefaultShipping: true },
        data: { isDefaultShipping: false }
      })
    }
    if (data.isDefaultBilling) {
      await prisma.address.updateMany({
        where: { userId: session.user.id, isDefaultBilling: true },
        data: { isDefaultBilling: false }
      })
    }

    const address = await prisma.address.update({
      where: { id, userId: session.user.id },
      data
    })
    
    return Response.json(address)
  } catch (err: any) {
    if (err instanceof z.ZodError) return Response.json({ error: err.errors[0].message }, { status: 422 })
    return Response.json({ error: "Failed to update address" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return new Response("Unauthorized", { status: 401 })

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get("id")
    if (!id) return new Response("Missing address ID", { status: 400 })

    await prisma.address.delete({
      where: { id, userId: session.user.id }
    })
    return Response.json({ success: true })
  } catch (err) {
    return Response.json({ error: "Failed to delete address" }, { status: 500 })
  }
}
