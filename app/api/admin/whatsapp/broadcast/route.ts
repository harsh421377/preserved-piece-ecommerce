import { NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth"
import { sendWhatsAppToNumber } from "@/lib/whatsapp";

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const { contacts, message } = await req.json();

    if (!contacts || !Array.isArray(contacts) || contacts.length === 0 || !message) {
      return NextResponse.json({ error: "Invalid payload: need contacts and message." }, { status: 400 });
    }

    let successCount = 0;
    let failCount = 0;

    // Send messages in sequence
    for (const contact of contacts) {
      if (contact.phone) {
        // Option here to replace placeholders like "{{name}}" with the customer's actual name
        const personalizedMessage = message.replace(/{{name}}/g, contact.name || "Customer");
        
        const success = await sendWhatsAppToNumber({ to: contact.phone, message: personalizedMessage });
        if (success) {
          successCount++;
        } else {
          failCount++;
        }
      }
    }

    return NextResponse.json({ success: true, successCount, failCount }, { status: 200 });
  } catch (error) {
    console.error("Broadcast error:", error);
    return NextResponse.json({ error: "Failed to broadcast message" }, { status: 500 });
  }
}
