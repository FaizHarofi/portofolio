import { createHmac } from "crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "pf_admin"
const SESSION_SECRET = process.env.SESSION_SECRET || ""
const SESSION_TTL_DAYS = Number(process.env.SESSION_TTL_DAYS || 7)
const SESSION_TTL = SESSION_TTL_DAYS * 24 * 60 * 60 * 1000
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123"

export function createToken(): string {
  const payload = JSON.stringify({ exp: Date.now() + SESSION_TTL })
  const sig = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex")
  return Buffer.from(payload).toString("base64") + "." + sig
}

export function verifyToken(token: string): boolean {
  try {
    const [payloadB64, sig] = token.split(".")
    const payload = Buffer.from(payloadB64, "base64").toString()
    const expected = createHmac("sha256", SESSION_SECRET).update(payload).digest("hex")
    if (sig !== expected) return false
    const { exp } = JSON.parse(payload)
    return exp > Date.now()
  } catch {
    return false
  }
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyToken(token)
}

export function checkPassword(input: string): boolean {
  return input === ADMIN_PASSWORD
}

export async function setSessionCookie(): Promise<void> {
  const token = createToken()
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: SESSION_TTL,
    path: "/",
  })
}

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
