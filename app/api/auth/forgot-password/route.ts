import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import bcrypt from "bcryptjs"
import { z } from "zod"
import { isRateLimited, getClientIp } from "@/lib/rate-limiter"

const schema = z.object({ email: z.string().email() })

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    const ip = getClientIp(req)

    // Rate limit by IP (max 3 forgot-password requests per 5 minutes)
    const ipLimit = isRateLimited({
      key: `forgot-password:ip:${ip}`,
      limit: 3,
      windowMs: 5 * 60 * 1000,
    })
    if (ipLimit.limited) {
      return Response.json(
        { error: `Too many requests. Please try again in ${Math.ceil(ipLimit.resetMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    // Rate limit by Email (max 3 forgot-password requests per 5 minutes)
    const emailLimit = isRateLimited({
      key: `forgot-password:email:${email}`,
      limit: 3,
      windowMs: 5 * 60 * 1000,
    })
    if (emailLimit.limited) {
      return Response.json(
        { error: `Too many requests for this email. Please try again in ${Math.ceil(emailLimit.resetMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user || !user.password) {
      console.warn(`[forgot-password] User not found or has no password set: ${email}`)
      return Response.json({ ok: true }) // Don't leak user existence
    }

    const otp = generateOtp()
    const hashed = await bcrypt.hash(otp, 10)
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.passwordResetToken.deleteMany({ where: { identifier: email } })
    await prisma.passwordResetToken.create({
      data: { identifier: email, token: hashed, expires },
    })

    await sendEmail({
      to: email,
      subject: "Reset your password OTP",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;border:1px solid #eee;">
          <h2 style="color:#a67c52;margin-bottom:8px;font-family:serif;">Reset Your Password</h2>
          <p style="color:#555;margin-bottom:24px;">Use the OTP below to reset your password. This code expires in 10 minutes.</p>
          <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#4a3f35;text-align:center;padding:20px;background:#fcfaf7;border-radius:8px;border:1px dashed #a67c52;">${otp}</div>
          <p style="color:#999;font-size:13px;margin-top:24px;">If you didn't request this, please ignore this email.</p>
        </div>
      `,
    })

    return Response.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.errors[0].message }, { status: 422 })
    }
    console.error("[forgot-password]", err)
    return Response.json({ error: "Failed to send reset OTP." }, { status: 500 })
  }
}

