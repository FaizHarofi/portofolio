"use client"

import { useEffect, useState, type FormEvent } from "react"
import { usePathname } from "next/navigation"
import { AdminProvider, useAdmin } from "./ui/state"
import { AdminLayout } from "@/components/admin-layout"
import { SitePage } from "./ui/site"
import { HeroPage } from "./ui/hero"
import { NavPage } from "./ui/nav"
import { AboutPage } from "./ui/about"
import { StackPage } from "./ui/stack"
import { CareerPage } from "./ui/career"
import { RolesPage } from "./ui/roles"
import { ServicesPage } from "./ui/services"
import { ProjectsPage } from "./ui/projects"
import { UploadPage } from "./ui/upload"
import { SocialsPage } from "./ui/socials"
import { TestimonialsPage } from "./ui/testimonials"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Field } from "./ui/fields"

function Login({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "same-origin",
        body: JSON.stringify({ password }),
      })
      const loginData = await loginRes.json().catch(() => null)
      if (!loginRes.ok) {
        setError(loginData?.message ?? "Password salah.")
        setLoading(false)
        return
      }
      const checkRes = await fetch("/api/auth/check", { credentials: "same-origin" })
      const checkData = await checkRes.json()
      if (checkData.authed) {
        onSuccess()
      } else {
        setError("Session gagal dibuat. Coba lagi.")
      }
    } catch {
      setError("Server tidak terjangkau.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-[100dvh] items-center justify-center px-4">
      <Card className="w-full max-w-sm py-6">
        <CardContent className="grid gap-4 px-6">
          <div className="grid gap-1">
            <h1 className="text-lg font-semibold">Admin Portofolio</h1>
            <p className="text-sm text-muted-foreground">Masuk untuk mengelola konten situs.</p>
          </div>
          <form onSubmit={submit} className="grid gap-3">
            <Field
              label="Password"
              value={password}
              onChange={setPassword}
              type="password"
              placeholder="â€¢â€¢â€¢â€¢â€¢â€¢â€¢â€¢"
            />
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" disabled={loading || !password}>
              {loading ? "Memeriksa..." : "Masuk"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminPages() {
  const pathname = usePathname()

  const segment = pathname.split("/admin/")[1] || "site"

  const pageMap: Record<string, React.ComponentType> = {
    site: SitePage,
    hero: HeroPage,
    nav: NavPage,
    about: AboutPage,
    stack: StackPage,
    career: CareerPage,
    roles: RolesPage,
    services: ServicesPage,
    projects: ProjectsPage,
    upload: UploadPage,
    socials: SocialsPage,
    testimonials: TestimonialsPage,
  }

  const Page = pageMap[segment] || SitePage

  return (
    <AdminLayout>
      <Page />
    </AdminLayout>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)

  useEffect(() => {
    fetch("/api/auth/check", { credentials: "same-origin" })
      .then((r) => r.json())
      .then((d: { authed: boolean }) => setAuthed(d.authed))
      .catch(() => setAuthed(false))
  }, [])

  if (authed === null) {
    return (
      <div className="flex min-h-[100dvh] items-center justify-center">
        <p className="text-sm text-muted-foreground">Memuat...</p>
      </div>
    )
  }

  if (!authed) {
    return <Login onSuccess={() => setAuthed(true)} />
  }

  return (
    <AdminProvider onLogout={() => setAuthed(false)}>
      <AdminPages />
    </AdminProvider>
  )
}

