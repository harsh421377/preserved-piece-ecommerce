import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { sendEmail } from "@/lib/email"
import { sendAdminWhatsAppMessage } from "@/lib/whatsapp"
import { autoSubscribeToNewsletter } from "@/lib/newsletter"
import { getPremiumEmailTemplate } from "@/lib/email-templates"
import crypto from "crypto"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"]

// Validate the incoming custom order payload
const CustomOrderSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Valid email is required"),
  phone: z.string().min(5, "Valid phone number is required"),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  pincode: z.string().optional(),
  productType: z.string().min(1, "Product type is required"),
  colorPreference: z.string().min(1, "Color preference is required"),
  decorativeElements: z.string().optional(),
  personalization: z.string().optional(),
  story: z.string().min(10, "Story requires at least 10 characters"),
  timeline: z.string().optional(),
  budget: z.string().optional(),
})

import fs from "fs"
import path from "path"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()

    // Extract metadata
    const data = {
      firstName: formData.get("firstName") as string || "",
      lastName: formData.get("lastName") as string || "",
      email: formData.get("email") as string || "",
      phone: formData.get("phone") as string || "",
      address: formData.get("address") as string || undefined,
      city: formData.get("city") as string || undefined,
      state: formData.get("state") as string || undefined,
      pincode: formData.get("pincode") as string || undefined,
      productType: formData.get("productType") as string || "",
      colorPreference: formData.get("colorPreference") as string || "",
      decorativeElements: formData.get("decorativeElements") as string || undefined,
      personalization: formData.get("personalization") as string || undefined,
      story: formData.get("story") as string || "",
      timeline: formData.get("timeline") as string || undefined,
      budget: formData.get("budget") as string || undefined,
    }

    const validatedData = CustomOrderSchema.parse(data)

    // Handle files
    const files = formData.getAll("images") as File[]
    const fileUrls: string[] = []

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    for (const file of files) {
      if (file && typeof file !== 'string' && file.size > 0) {
        // 1. Validate File Size
        if (file.size > MAX_FILE_SIZE) {
          return NextResponse.json({ error: "File size exceeds 5MB limit" }, { status: 400 })
        }

        // 2. Validate MIME Type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          return NextResponse.json({ error: "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed." }, { status: 400 })
        }

        // 3. Validate and sanitize Extension
        const originalExt = path.extname(file.name).toLowerCase()
        if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
          return NextResponse.json({ error: "Invalid file extension" }, { status: 400 })
        }

        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)

        // Generate a randomized secure filename
        const filename = `${Date.now()}-${crypto.randomUUID()}${originalExt}`
        const filepath = path.join(uploadDir, filename)
        
        fs.writeFileSync(filepath, buffer)
        fileUrls.push(`/uploads/${filename}`)
      }
    }

    const customOrder = await prisma.customOrderRequest.create({
      data: {
        ...validatedData,
        referenceImages: fileUrls.length > 0 ? JSON.stringify(fileUrls) : null,
        status: "PENDING",
      }
    })

    await Promise.allSettled([
      autoSubscribeToNewsletter(validatedData.email),
      sendEmail({
        to: validatedData.email,
        subject: "Your Custom Order Request was Received",
        html: getPremiumEmailTemplate(
          "Custom Order Request Received",
          `<p>Hi ${validatedData.firstName},</p>
           <p>Thank you for submitting a custom order request for a <strong>${validatedData.productType}</strong>.</p>
           <p>Our artisans will review your story and requirements shortly, and we'll reach out with the next steps.</p>`
        )
      }),
      sendEmail({
        to: process.env.STORE_EMAIL || "admin@example.com",
        subject: `New Custom Order Request: ${validatedData.firstName} ${validatedData.lastName}`,
        html: getPremiumEmailTemplate(
          "New Custom Order Request",
          `<p>A new custom order was submitted by <strong>${validatedData.firstName} ${validatedData.lastName}</strong> (${validatedData.email}):</p>
           <ul>
             <li><strong>Type:</strong> ${validatedData.productType}</li>
             <li><strong>Color:</strong> ${validatedData.colorPreference}</li>
             <li><strong>Timeline:</strong> ${validatedData.timeline || 'N/A'}</li>
             <li><strong>Budget:</strong> ${validatedData.budget || 'N/A'}</li>
           </ul>
           <p><strong>Story:</strong></p>
           <p style="padding: 15px; background-color: rgba(255,255,255,0.05); border-radius: 8px;">${validatedData.story}</p>`
        )
      }),
      sendAdminWhatsAppMessage({
        message: `New Custom Order Request\nFrom: ${validatedData.firstName} ${validatedData.lastName}\nType: ${validatedData.productType}`,
      }),
    ])

    return NextResponse.json({ success: true, id: customOrder.id }, { status: 201 })
  } catch (error) {
    console.error("Custom order submission error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Failed to submit custom order" }, { status: 500 })
  }
}

