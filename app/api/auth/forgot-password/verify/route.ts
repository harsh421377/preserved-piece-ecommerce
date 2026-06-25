import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { isRateLimited, getClientIp } from "@/lib/rate-limiter"

const schema = z.object({
  email: z.string().email(),
  otp: z.string().min(6).max(6),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email, otp } = schema.parse(body)

    const ip = getClientIp(req)

    // Rate limit verify attempts (max 10 verification requests per 10 minutes)
    const ipLimit = isRateLimited({
      key: `verify-otp:ip:${ip}`,
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
      key: `verify-otp:email:${email}`,
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

    let matched = false
    for (const r of records) {
      if (await bcrypt.compare(otp, r.token)) {
        matched = true
        break
      }
    }

    if (!matched) {
      return Response.json({ error: "Invalid or expired OTP." }, { status: 400 })
    }

    return Response.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.errors[0].message }, { status: 422 })
    }
    console.error("[forgot-password/verify]", err)
    return Response.json({ error: "Failed to verify OTP." }, { status: 500 })
  }
}
