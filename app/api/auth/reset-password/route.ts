import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { isRateLimited, getClientIp } from "@/lib/rate-limiter"

const schema = z.object({
  email: z.string().email(),
  token: z.string().min(1),
  password: z.string().min(8, "Password must be at least 8 characters"),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, token, password } = schema.parse(body)

    const ip = getClientIp(req)

    // Rate limit reset attempts (max 10 requests per 10 minutes)
    const ipLimit = isRateLimited({
      key: `reset-password:ip:${ip}`,
      limit: 10,
      windowMs: 10 * 60 * 1000,
    })
    if (ipLimit.limited) {
      return Response.json(
        { error: `Too many attempts. Please try again in ${Math.ceil(ipLimit.resetMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    const emailLimit = isRateLimited({
      key: `reset-password:email:${email}`,
      limit: 10,
      windowMs: 10 * 60 * 1000,
    })
    if (emailLimit.limited) {
      return Response.json(
        { error: `Too many attempts for this email. Please try again in ${Math.ceil(emailLimit.resetMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    const records = await prisma.passwordResetToken.findMany({
      where: { identifier: email, used: false, expires: { gt: new Date() } },
    })

    let matched: (typeof records)[0] | null = null
    for (const r of records) {
      if (await bcrypt.compare(token, r.token)) {
        matched = r
        break
      }
    }

    if (!matched) {
      return Response.json({ error: "Invalid or expired reset link." }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 12)

    await prisma.$transaction([
      prisma.user.update({ where: { email }, data: { password: hashed } }),
      prisma.passwordResetToken.update({ where: { id: matched.id }, data: { used: true } }),
    ])

    return Response.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.errors[0].message }, { status: 422 })
    }
    console.error("[reset-password]", err)
    return Response.json({ error: "Something went wrong." }, { status: 500 })
  }
}
