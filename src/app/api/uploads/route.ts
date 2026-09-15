import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/server/auth"
import { readdirSync, unlinkSync, existsSync } from "fs"
import path from "path"

const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads")

export async function GET() {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    if (!existsSync(UPLOADS_DIR)) return NextResponse.json([])
    const files = readdirSync(UPLOADS_DIR)
      .filter((n) => !n.startsWith("."))
      .map((name) => ({
        filename: name.replace(/^\d+-/, ""),
        pathname: name,
        url: `/uploads/${name}`,
      }))
    return NextResponse.json(files)
  } catch {
    return NextResponse.json([])
  }
}

export async function DELETE(request: Request) {
  try {
    if (!(await isAuthenticated())) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }
    const { searchParams } = new URL(request.url)
    const pathname = searchParams.get("pathname")
    if (!pathname) {
      return NextResponse.json({ success: false, message: "pathname is required" }, { status: 400 })
    }
    const safeName = path.basename(pathname)
    const filePath = path.join(UPLOADS_DIR, safeName)
    if (!existsSync(filePath)) {
      return NextResponse.json({ success: false, message: "File not found" }, { status: 404 })
    }
    unlinkSync(filePath)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, message: (err as Error)?.message ?? "Delete failed" }, { status: 500 })
  }
}
