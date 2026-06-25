import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { z } from "zod"

const patchSchema = z.object({
  name: z.string().min(1).optional(),
  phone: z.string().optional(),
  dob: z.string().optional().nullable(),
  gender: z.string().optional().nullable(),
  image: z.string().url().optional().or(z.literal("")),
})

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { id: true, name: true, email: true, phone: true, image: true, role: true, isProfileComplete: true, createdAt: true, dob: true, gender: true, loyaltyPoints: true },
  })
  return Response.json(user)
}

export async function PATCH(req: Request) {
  const session = await auth()
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }
  try {
    const body = await req.json()
    const data = patchSchema.parse(body)

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...data, dob: data.dob ? new Date(data.dob) : undefined, isProfileComplete: true },
      select: { id: true, name: true, email: true, phone: true, image: true, isProfileComplete: true, dob: true, gender: true, loyaltyPoints: true },
    })
    return Response.json(updated)
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.errors[0].message }, { status: 422 })
    }
    return Response.json({ error: "Failed to update profile." }, { status: 500 })
  }
}
