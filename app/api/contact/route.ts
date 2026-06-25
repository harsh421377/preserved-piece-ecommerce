import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { sendAdminWhatsAppMessage } from "@/lib/whatsapp"
import { autoSubscribeToNewsletter } from "@/lib/newsletter"
import { getPremiumEmailTemplate } from "@/lib/email-templates"

const ContactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  subject: z.string().min(2).max(200),
  message: z.string().min(10).max(2000),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const data = ContactSchema.parse(body)
    const msg = await prisma.contactMessage.create({ data })

    await Promise.allSettled([
      autoSubscribeToNewsletter(data.email),
      sendEmail({
        to: data.email,
        subject: "We received your message!",
        html: getPremiumEmailTemplate(
          "We Received Your Message",
          `<p>Hi ${data.name},</p><p>Thank you for reaching out to us regarding <strong>"${data.subject}"</strong>.</p><p>We are reviewing your message and will get back to you shortly.</p>`
        )
      }),
      sendEmail({
        to: process.env.STORE_EMAIL || "admin@example.com",
        subject: `New Contact Message: ${data.subject}`,
        html: getPremiumEmailTemplate(
          "New Contact Form Submission",
          `<p>You have a new message from <strong>${data.name}</strong> (${data.email}):</p>
           <p style="padding: 15px; background-color: rgba(255,255,255,0.05); border-radius: 8px;">${data.message}</p>`
        )
      }),
      sendAdminWhatsAppMessage({
        message: `New Contact Message from ${data.name}: ${data.subject}\n\n${data.message}`,
      }),
    ])

    return NextResponse.json({ success: true, id: msg.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 })
  }
}
