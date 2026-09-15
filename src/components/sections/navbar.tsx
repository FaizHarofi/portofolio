"use client"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Menu, Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme"
import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useContent } from "@/lib/content"

export function Navbar() {
  const { theme, toggle } = useTheme()
  const { navLinks, site } = useContent()
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const isSubPage = pathname !== "/"

  function resolvedHref(href: string) {
    if (isSubPage && href.startsWith("#")) return "/" + href
    return href
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border/60 bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <a
          href={isSubPage ? "/" : "#top"}
          className="text-sm font-extrabold tracking-[0.2em] focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
        >
          {site.name}
        </a>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Primary">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={resolvedHref(link.href)}
              className="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={toggle} aria-label="Toggle theme">
            {theme === "dark" ? (
              <Sun className="size-5" aria-hidden="true" />
            ) : (
              <Moon className="size-5" aria-hidden="true" />
            )}
          </Button>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Toggle menu"
              >
                <Menu className="size-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="text-sm font-extrabold tracking-[0.2em]">
                {site.name}
              </SheetTitle>
              <SheetDescription className="sr-only">Site navigation</SheetDescription>
              <nav className="mt-4 flex flex-col gap-1" aria-label="Mobile">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={resolvedHref(link.href)}
                    onClick={() => setOpen(false)}
                    className="rounded-md px-3 py-3 text-base text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none"
                  >
                    {link.label}
                  </a>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}
