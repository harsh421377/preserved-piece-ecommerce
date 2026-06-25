import { NextResponse } from "next/server";
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(subscribers);
  } catch (error) {
    console.error("Error fetching subscribers:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}
