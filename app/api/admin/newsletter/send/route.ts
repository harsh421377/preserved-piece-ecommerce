import { NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { subject, content } = await req.json();

    if (!subject || !content) {
      return NextResponse.json({ error: "Missing subject or content" }, { status: 400 });
    }

    const subscribers = await prisma.newsletterSubscriber.findMany({
      where: { isActive: true }
    });

    // Sandbox execution: Log emails instead of actually sending
    console.log(`[SANDBOX MAIL] Sending Newsletter to ${subscribers.length} subscribers.`);
    console.log(`[SANDBOX MAIL] Subject: ${subject}`);
    console.log(`[SANDBOX MAIL] Content: ${content.substring(0, 100)}...`);

    // In a real app we would use Resend, Sendgrid, etc.
    // await sendEmail({ to: subscribers.map(s => s.email), subject, html: content });

    return NextResponse.json({
      success: true,
      message: `Mock email successfully sent to ${subscribers.length} subscribers!`,
      recipientCount: subscribers.length
    }, { status: 200 });
  } catch (error) {
    console.error("Error sending newsletter:", error);
    return NextResponse.json({ error: "Failed to send newsletter" }, { status: 500 });
  }
}
