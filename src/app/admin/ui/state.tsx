import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react"

import { defaultContent, type PortfolioContent } from "@/lib/data"
import { useToast } from "@/components/ui/toast"

type AdminState = {
  content: PortfolioContent
  loading: boolean
  set: <K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) => void
  load: () => Promise<void>
  saveSection: (keys: (keyof PortfolioContent)[]) => Promise<boolean>
  logout: () => Promise<void>
  saving: boolean
  saved: boolean
}

const Ctx = createContext<AdminState | null>(null)

export function AdminProvider({ children, onLogout }: { children: ReactNode; onLogout: () => void }) {
  const [content, setContent] = useState<PortfolioContent>(defaultContent)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const contentRef = useRef(content)
  contentRef.current = content
  const { toast } = useToast()

  function set<K extends keyof PortfolioContent>(key: K, value: PortfolioContent[K]) {
    setContent((c) => ({ ...c, [key]: value } as PortfolioContent))
  }

  async function load(attempt = 1) {
    setLoading(true)
    try {
      const res = await fetch("/api/content", { credentials: "same-origin" })
      if (res.ok) {
        const data = await res.json()
        setContent((prev) => ({ ...prev, ...data }))
      } else {
        console.warn("[admin] load failed:", res.status)
      }
    } catch (err) {
      if (attempt < 3) {
        console.warn(`[admin] load attempt ${attempt} failed, retrying in ${attempt * 1000}ms...`)
        await new Promise((r) => setTimeout(r, attempt * 1000))
        return load(attempt + 1)
      }
      console.error("[admin] load network error after 3 attempts:", err)
      toast("Server tidak terjangkau. Refresh halaman setelah server siap.", "error")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  async function saveSection(keys: (keyof PortfolioContent)[]) {
    setSaving(true)
    setSaved(false)
    const partial: Record<string, unknown> = {}
    for (const k of keys) {
      partial[k] = contentRef.current[k]
    }
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify(partial),
      })
      const body = await res.json().catch(() => null)
      if (res.ok) {
        setSaved(true)
        toast("Berhasil disimpan.", "success")
        window.setTimeout(() => setSaved(false), 2500)
        return true
      }
      if (res.status === 401) {
        console.warn("[admin] save got 401 — session expired, logging out")
        toast("Sesi habis. Silakan masuk kembali.", "error")
        await logout()
        return false
      }
      console.error("[admin] save failed:", res.status, body)
      toast(body?.message ?? "Gagal menyimpan.", "error")
      return false
    } catch (err) {
      console.error("[admin] save network error:", err)
      toast("Server tidak terjangkau. Periksa koneksi internet.", "error")
      return false
    } finally {
      setSaving(false)
    }
  }

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST", credentials: "same-origin" }).catch(() => undefined)
    onLogout()
  }

  return (
    <Ctx.Provider value={{ content, loading, set, load, saveSection, logout, saving, saved }}>
      {children}
    </Ctx.Provider>
  )
}

export function useAdmin() {
  const v = useContext(Ctx)
  if (!v) throw new Error("useAdmin must be used within AdminProvider")
  return v
}
