import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  phone: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { name, email, password, phone } = schema.parse(body)

    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return Response.json({ error: "An account with this email already exists." }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)
    await prisma.user.create({
      data: { name, email, password: hashed, phone: phone ?? null },
    })

    return Response.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.errors[0].message }, { status: 422 })
    }
    console.error("[register]", err)
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 })
  }
}
