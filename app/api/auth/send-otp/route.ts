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

    // Rate limit by IP (max 3 OTP requests per 5 minutes)
    const ipLimit = isRateLimited({
      key: `send-otp:ip:${ip}`,
      limit: 3,
      windowMs: 5 * 60 * 1000,
    })
    if (ipLimit.limited) {
      return Response.json(
        { error: `Too many requests. Please try again in ${Math.ceil(ipLimit.resetMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    // Rate limit by Email (max 3 OTP requests per 5 minutes)
    const emailLimit = isRateLimited({
      key: `send-otp:email:${email}`,
      limit: 3,
      windowMs: 5 * 60 * 1000,
    })
    if (emailLimit.limited) {
      return Response.json(
        { error: `Too many requests for this email. Please try again in ${Math.ceil(emailLimit.resetMs / 1000)} seconds.` },
        { status: 429 }
      )
    }

    const otp = generateOtp()
    const hashed = await bcrypt.hash(otp, 10)
    const expires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await prisma.verificationToken.deleteMany({ where: { identifier: email } })
    await prisma.verificationToken.create({
      data: { identifier: email, token: hashed, expires },
    })

    await sendEmail({
      to: email,
      subject: "Your login code",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px;background:#fff;border-radius:12px;">
          <h2 style="color:#7C3AED;margin-bottom:8px;">Your Login Code</h2>
          <p style="color:#555;margin-bottom:24px;">Use the code below to sign in to your account. It expires in 10 minutes.</p>
          <div style="font-size:40px;font-weight:700;letter-spacing:12px;color:#1a1a1a;text-align:center;padding:20px;background:#f5f0ff;border-radius:8px;">${otp}</div>
          <p style="color:#999;font-size:13px;margin-top:24px;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
    })

    return Response.json({ ok: true })
  } catch (err) {
    if (err instanceof z.ZodError) {
      return Response.json({ error: err.errors[0].message }, { status: 422 })
    }
    console.error("[send-otp]", err)
    return Response.json({ error: "Failed to send OTP." }, { status: 500 })
  }
}
