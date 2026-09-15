import { useContent } from "@/lib/content"

export function Footer() {
  const { site } = useContent()

  return (
    <footer className="border-t border-border/60 py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <span className="text-sm font-extrabold tracking-[0.2em]">{site.name}</span>
        <p className="text-sm text-muted-foreground">
          Built with React, Tailwind CSS and Motion.
        </p>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} {site.name}
        </p>
      </div>
    </footer>
  )
}
