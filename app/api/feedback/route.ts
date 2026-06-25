import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email"
import { sendAdminWhatsAppMessage } from "@/lib/whatsapp"
import { autoSubscribeToNewsletter } from "@/lib/newsletter"
import { getPremiumEmailTemplate } from "@/lib/email-templates"

export async function POST(req: Request) {
  try {
    const { name, email, rating, message } = await req.json();

    if (!name || rating === undefined || !message) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const feedback = await prisma.feedback.create({
      data: {
        name,
        email: email || null,
        rating: Number(rating),
        message,
      },
    });

    const promises = [];
    if (email) {
      promises.push(autoSubscribeToNewsletter(email));
    }
    promises.push(
      sendEmail({
        to: process.env.STORE_EMAIL || "admin@example.com",
        subject: `New Feedback Received from ${name}`,
        html: getPremiumEmailTemplate(
          "New Customer Feedback",
          `<p><strong>${name}</strong> submitted new feedback:</p>
           <p><strong>Rating:</strong> ${rating} / 5</p>
           <p style="padding: 15px; background-color: rgba(255,255,255,0.05); border-radius: 8px;">${message}</p>`
        )
      }),
      sendAdminWhatsAppMessage({
        message: `New Feedback from ${name}\nRating: ${rating}/5\n${message}`,
      })
    );
    await Promise.allSettled(promises);

    return NextResponse.json({ success: true, data: feedback }, { status: 201 });
  } catch (error) {
    console.error("Error creating feedback:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
