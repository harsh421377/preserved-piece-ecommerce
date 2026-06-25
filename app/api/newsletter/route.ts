import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email"
import { sendAdminWhatsAppMessage } from "@/lib/whatsapp"
import { getPremiumEmailTemplate } from "@/lib/email-templates"

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Try to find if the user is already subscribed
    const existingSubscriber = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      return NextResponse.json({ message: "Already subscribed!" }, { status: 200 });
    }

    const subscriber = await prisma.newsletterSubscriber.create({
      data: { email },
    });

    await Promise.allSettled([
      sendEmail({
        to: email,
        subject: "Welcome to Our Newsletter!",
        html: getPremiumEmailTemplate(
          "Welcome to Preserved Piece!",
          `<p>Hi there,</p>
           <p>Thank you for subscribing to our newsletter! We're thrilled to have you join our community.</p>
           <p>You'll be the first to know about our latest artisan collections, special offers, and new preservation techniques.</p>`
        )
      }),
      sendEmail({
        to: process.env.STORE_EMAIL || "admin@example.com",
        subject: `New Newsletter Subscriber`,
        html: getPremiumEmailTemplate(
          "New Subscriber",
          `<p>You have a new newsletter subscriber!</p>
           <p><strong>Email:</strong> ${email}</p>`
        )
      }),
      sendAdminWhatsAppMessage({
        message: `New Subscriber ✉️\nEmail: ${email}`,
      }),
    ])

    return NextResponse.json({ success: true, data: subscriber }, { status: 201 });
  } catch (error) {
    console.error("Error creating subscriber:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
