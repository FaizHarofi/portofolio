import { NextResponse } from "next/server"
import { isAuthenticated } from "@/lib/server/auth"

export async function GET() {
  const authed = await isAuthenticated()
  return NextResponse.json({ authed })
}
