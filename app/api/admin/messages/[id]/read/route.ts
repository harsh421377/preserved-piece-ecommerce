import { NextResponse } from "next/server"
import { auth, isAdmin } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PATCH(request: Request, context: any) {
  try {
    const session = await auth()
    if (!isAdmin(session)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    const params = await Promise.resolve(context.params);
    const id = params.id;
    const body = await request.json();
    
    if (typeof body.read !== 'boolean') {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const updatedMsg = await prisma.contactMessage.update({
      where: { id },
      data: { read: body.read }
    });
    
    return NextResponse.json(updatedMsg);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update message status" }, { status: 500 });
  }
}
