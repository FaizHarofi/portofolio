import { NextResponse } from "next/server"
import { checkPassword, setSessionCookie } from "@/lib/server/auth"

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null)
    const password = body?.password
    if (typeof password !== "string" || !checkPassword(password)) {
      return NextResponse.json({ success: false, message: "Password salah." }, { status: 401 })
    }
    await setSessionCookie()
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error("[api] POST /api/auth/login error:", err)
    return NextResponse.json({ success: false, message: "Terjadi kesalahan." }, { status: 500 })
  }
}
