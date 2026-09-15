"use client"

import { useState, type ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, RefreshCw, Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAdmin } from "@/app/admin/ui/state"

const NAV = [
  { to: "/admin/site", label: "Identitas" },
  { to: "/admin/hero", label: "Hero" },
  { to: "/admin/nav", label: "Navigasi" },
  { to: "/admin/about", label: "Tentang" },
  { to: "/admin/stack", label: "Stack" },
  { to: "/admin/career", label: "Karir" },
  { to: "/admin/roles", label: "Peran" },
  { to: "/admin/services", label: "Layanan" },
  { to: "/admin/projects", label: "Proyek" },
  { to: "/admin/upload", label: "Upload" },
  { to: "/admin/socials", label: "Sosial" },
  { to: "/admin/testimonials", label: "Testimoni" },
]

function NavItem({ to, label, onClick }: { to: string; label: string; onClick?: () => void }) {
  const pathname = usePathname()
  const isActive = pathname === to
  return (
    <li>
      <Link
        href={to}
        onClick={onClick}
        className={`flex items-center justify-between rounded-md px-3 py-2 text-sm transition-colors ${
          isActive ? "bg-primary/10 text-primary" : "text-foreground/80 hover:bg-muted"
        }`}
      >
        <span>{label}</span>
        {isActive ? <span className="size-1.5 rounded-full bg-primary" /> : null}
      </Link>
    </li>
  )
}

export function AdminLayout({ children }: { children: ReactNode }) {
  const { load, logout } = useAdmin()
  const [open, setOpen] = useState(false)

  return (
    <div className="min-h-[100dvh] bg-background">
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-md">
        <div className="flex h-16 items-center gap-3 px-4 md:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Buka menu"
            aria-expanded={open}
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>
          <div className="min-w-0 flex-1">
            <h1 className="truncate font-bold">Admin Portofolio</h1>
            <p className="truncate text-xs text-muted-foreground">Kelola semua konten situs</p>
          </div>
          <Button variant="outline" size="sm" onClick={load}>
            <RefreshCw className="size-4" />
            <span className="hidden sm:inline">Muat Ulang</span>
          </Button>
          <button
            type="button"
            onClick={() => logout()}
            className="inline-flex size-9 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            aria-label="Keluar"
          >
            <LogOut className="size-4" />
          </button>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setOpen(false)} />
      )}

      <aside
        className={
          "fixed inset-y-0 left-0 z-50 w-64 bg-background border-r border-border shadow-lg transition-transform duration-200 md:hidden " +
          (open ? "translate-x-0" : "-translate-x-full")
        }
      >
        <div className="flex h-16 items-center border-b border-border px-4">
          <span className="text-sm font-semibold">Menu</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="ml-auto inline-flex size-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
            aria-label="Tutup menu"
          >
            <X className="size-4" />
          </button>
        </div>
        <nav className="p-3">
          <ul className="grid gap-1">
            {NAV.map((item) => (
              <NavItem key={item.to} {...item} onClick={() => setOpen(false)} />
            ))}
          </ul>
        </nav>
      </aside>

      <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 md:px-6">
        <aside className="hidden md:block w-60 shrink-0">
          <nav className="sticky top-20">
            <ul className="grid gap-1">
              {NAV.map((item) => (
                <NavItem key={item.to} {...item} />
              ))}
            </ul>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
