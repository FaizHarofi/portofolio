import { NextResponse } from "next/server"
import { loadContent, saveContent } from "@/lib/server/db"
import { isAuthenticated } from "@/lib/server/auth"

export async function GET() {
  try {
    const { content, source } = await loadContent()
    const res = NextResponse.json(content)
    res.headers.set("X-Content-Source", source)
    return res
  } catch (err) {
    console.error(`[API CONTENT ERROR]`)
    console.error(`  Time:   ${new Date().toISOString()}`)
    console.error(`  Method: GET`)
    console.error(`  Path:   /api/content`)
    console.error(`  Action: load`)
    console.error(`  Status: 500`)
    console.error(`  Error:  ${(err as Error)?.message ?? err}`)
    console.error(`  Stack:  ${(err as Error)?.stack ?? "(no stack)"}`)
    return NextResponse.json(
      { success: false, message: "Gagal memuat konten." },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const start = Date.now()
  try {
    if (!(await isAuthenticated())) {
      console.error(`[API CONTENT ERROR]`)
      console.error(`  Time:   ${new Date().toISOString()}`)
      console.error(`  Method: PUT`)
      console.error(`  Path:   /api/content`)
      console.error(`  Action: save`)
      console.error(`  Status: 401`)
      console.error(`  Reason: No valid session cookie`)
      return NextResponse.json(
        { success: false, message: "Sesi tidak valid. Silakan masuk kembali." },
        { status: 401 }
      )
    }

    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      console.error(`[API CONTENT ERROR]`)
      console.error(`  Time:   ${new Date().toISOString()}`)
      console.error(`  Method: PUT`)
      console.error(`  Path:   /api/content`)
      console.error(`  Action: save`)
      console.error(`  Status: 400`)
      console.error(`  Reason: Malformed JSON body`)
      return NextResponse.json(
        { success: false, message: "Data tidak valid (JSON malformed)." },
        { status: 400 }
      )
    }

    if (!body || typeof body !== "object") {
      console.error(`[API CONTENT ERROR]`)
      console.error(`  Time:   ${new Date().toISOString()}`)
      console.error(`  Method: PUT`)
      console.error(`  Path:   /api/content`)
      console.error(`  Action: save`)
      console.error(`  Status: 400`)
      console.error(`  Reason: Invalid payload (type=${typeof body})`)
      return NextResponse.json(
        { success: false, message: "Data tidak valid." },
        { status: 400 }
      )
    }

    const keys = Object.keys(body)
    await saveContent(body)
    const ms = Date.now() - start
    console.log(`[api] PUT /api/content -> 200 (${ms}ms, keys: ${keys.join(", ")})`)
    return NextResponse.json({ success: true, message: "Konten berhasil disimpan." })
  } catch (err) {
    const ms = Date.now() - start
    console.error(`[API CONTENT ERROR]`)
    console.error(`  Time:   ${new Date().toISOString()}`)
    console.error(`  Method: PUT`)
    console.error(`  Path:   /api/content`)
    console.error(`  Action: save`)
    console.error(`  Status: 500`)
    console.error(`  Duration: ${ms}ms`)
    console.error(`  Error:  ${(err as Error)?.message ?? err}`)
    console.error(`  Stack:  ${(err as Error)?.stack ?? "(no stack)"}`)
    return NextResponse.json(
      { success: false, message: "Terjadi kesalahan pada server. Silakan coba lagi." },
      { status: 500 }
    )
  }
}
