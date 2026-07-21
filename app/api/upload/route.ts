import { NextRequest, NextResponse } from "next/server"
import path from "path"
import { auth } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]
const ALLOWED_EXTENSIONS = [
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".gif",
]

export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const files = formData.getAll("images") as File[]

    if (!files.length) {
      return NextResponse.json(
        { error: "No files uploaded" },
        { status: 400 }
      )
    }

    const fileUrls: string[] = []

    for (const file of files) {
      if (!file || typeof file === "string" || file.size === 0) continue

      // Validate file size
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { error: "File size exceeds 5MB limit" },
          { status: 400 }
        )
      }

      // Validate MIME type
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            error:
              "Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed.",
          },
          { status: 400 }
        )
      }

      // Validate extension
      const originalExt = path.extname(file.name).toLowerCase()

      if (!ALLOWED_EXTENSIONS.includes(originalExt)) {
        return NextResponse.json(
          { error: "Invalid file extension" },
          { status: 400 }
        )
      }

      const bytes = await file.arrayBuffer()
      const buffer = Buffer.from(bytes)

      const imageUrl = await new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: "preserved-piece",
            resource_type: "image",
          },
          (error, result) => {
            if (error || !result) {
              reject(error)
            } else {
              resolve(result.secure_url)
            }
          }
        )

        uploadStream.end(buffer)
      })
      fileUrls.push(imageUrl)
    }

    return NextResponse.json(
      {
        urls: fileUrls,
      },
      {
        status: 201,
      }
    )
  } catch (error) {
    console.error("[POST /api/upload]", error)

    return NextResponse.json(
      {
        error: "Failed to upload files",
      },
      {
        status: 500,
      }
    )
  }
}