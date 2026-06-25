import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth, isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!isAdmin(session)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const [orders, customOrders, contactMessages] = await Promise.all([
      prisma.order.findMany({ select: { firstName: true, lastName: true, phone: true } }),
      prisma.customOrderRequest.findMany({ select: { firstName: true, lastName: true, phone: true } }),
      prisma.contactMessage.findMany({ select: { name: true, phone: true } }),
    ]);

    const contactsMap = new Map<string, any>();

    // Normalize phone numbers (basic stripping of spaces)
    const normalizePhone = (p: string) => p.replace(/\s+/g, '');

    orders.forEach((o) => {
      if (o.phone && o.phone.length > 5) {
        const p = normalizePhone(o.phone);
        if (!contactsMap.has(p)) {
          contactsMap.set(p, { name: `${o.firstName} ${o.lastName}`.trim(), phone: p, source: "Order" });
        }
      }
    });

    customOrders.forEach((co) => {
      if (co.phone && co.phone.length > 5) {
        const p = normalizePhone(co.phone);
        if (!contactsMap.has(p)) {
          contactsMap.set(p, { name: `${co.firstName} ${co.lastName}`.trim(), phone: p, source: "Custom Order" });
        }
      }
    });

    contactMessages.forEach((cm) => {
      if (cm.phone && cm.phone.length > 5) {
        const p = normalizePhone(cm.phone);
        if (!contactsMap.has(p)) {
          contactsMap.set(p, { name: cm.name, phone: p, source: "Contact Form" });
        }
      }
    });

    return NextResponse.json(Array.from(contactsMap.values()));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json({ error: "Failed to fetch contacts" }, { status: 500 });
  }
}
