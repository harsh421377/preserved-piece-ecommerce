import { NextRequest, NextResponse } from "next/server"
import fs from "fs"
import path from "path"
import crypto from "crypto"
import { auth } from "@/lib/auth"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const ALLOWED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".gif"]

export async function POST(request: NextRequest) {
  try {
    const session = await auth()
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("images") as File[]
    const fileUrls: string[] = []

    const uploadDir = path.join(process.cwd(), "public", "uploads")
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }

    for (const file of files) {
      if (file && typeof file !== "string" && file.size > 0) {
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

    return NextResponse.json({ urls: fileUrls }, { status: 201 })
  } catch (error) {
    console.error("[POST /api/upload]", error)
    return NextResponse.json({ error: "Failed to upload files" }, { status: 500 })
  }
}
