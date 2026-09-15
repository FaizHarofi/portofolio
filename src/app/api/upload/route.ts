import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/server/auth"
import { writeFileSync } from "fs"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN

export async function POST(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    const body = await request.json().catch(() => null)
    const { filename, contentType, data } = body ?? {}
    if (typeof filename !== "string" || typeof data !== "string") {
      return NextResponse.json({ success: false, message: "filename and data (base64) are required" }, { status: 400 })
    }
    const safeName = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9._-]/g, "_")}`

    if (BLOB_TOKEN) {
      try {
        const { put } = await import("@vercel/blob")
        const buffer = Buffer.from(data, "base64")
        const blob = await put(`portfolio/${safeName}`, buffer, {
          access: "public",
          contentType: typeof contentType === "string" ? contentType : "application/octet-stream",
          token: BLOB_TOKEN,
        })
        return NextResponse.json({ success: true, url: blob.url, pathname: blob.pathname })
      } catch (err) {
        console.error("[blob] upload failed:", err)
        return NextResponse.json({ success: false, message: (err as Error)?.message ?? "Upload failed" }, { status: 500 })
      }
    }
    const buffer = Buffer.from(data, "base64")
    const filePath = path.join(UPLOADS_DIR, safeName)
    writeFileSync(filePath, buffer)
    return NextResponse.json({ success: true, url: `/uploads/${safeName}`, pathname: safeName })
  } catch (err) {
    console.error("[api] POST /api/upload error:", err)
    return NextResponse.json({ success: false, message: (err as Error)?.message ?? "Upload failed" }, { status: 500 })
  }
}
