import { useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Hash, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, Field } from "./fields"
import { Icon } from "@/components/ui/icon"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { TechItem } from "@/lib/data"

function IconPreview({ slug, color, emoji, className }: { slug: string; color?: string; emoji?: string; className?: string }) {
  const [failed, setFailed] = useState(false)
  if (emoji) {
    return (
      <span className={"size-5 " + (className ?? "")} role="img" aria-hidden="true">
        {emoji}
      </span>
    )
  }
  if (!slug || failed) {
    return (
      <span
        className={
          "flex size-5 items-center justify-center text-muted-foreground/50 " +
          (className ?? "")
        }
        aria-hidden="true"
      >
        <Hash className="size-4" />
      </span>
    )
  }
  return (
    <Icon slug={slug} color={color} className={"size-5 " + (className ?? "")} />
  )
}

export function StackPage() {
  const { content, set } = useAdmin()
  const items = content.stack ?? []
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  function update(index: number, patch: Partial<TechItem>) {
    set(
      "stack",
      items.map((it, i) => (i === index ? { ...it, ...patch } : it))
    )
  }

  function move(index: number, dir: -1 | 1) {
    const target = index + dir
    if (target < 0 || target >= items.length) return
    const next = [...items]
    ;[next[index], next[target]] = [next[target], next[index]]
    set("stack", next)
    setOpenIdx(target)
  }

  function remove(index: number) {
    set(
      "stack",
      items.filter((_, i) => i !== index)
    )
    setOpenIdx(null)
  }

  function add() {
    const next = [...items, { name: "", slug: "", color: "", emoji: "" }]
    set("stack", next)
    setOpenIdx(next.length - 1)
  }

  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Stack</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} teknologi — klik baris untuk edit.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SaveButton section={["stack"]} />
            <Button type="button" size="sm" onClick={add}>
              <Plus className="size-4" aria-hidden="true" />
              Tambah
            </Button>
          </div>
        </div>

        <div className="mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border">
          {items.map((item, i) => {
            const open = openIdx === i
            return (
              <div key={i} className={open ? "bg-muted/30" : undefined}>
                <button
                  type="button"
                  onClick={() => setOpenIdx(open ? null : i)}
                  aria-expanded={open}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-muted/50"
                >
                  <IconPreview slug={item.slug} color={item.color} emoji={item.emoji} className="shrink-0" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {item.name || "(tanpa nama)"}
                    </span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {item.slug || "slug kosong"}
                    </span>
                  </span>
                  <ChevronDown
                    className={
                      "size-4 shrink-0 text-muted-foreground transition-transform " +
                      (open ? "rotate-180" : "")
                    }
                    aria-hidden="true"
                  />
                </button>

                <Collapsible open={open}>
                  <div className="grid gap-3 px-4 pb-4 pt-1 sm:grid-cols-[1fr_1fr_1fr_auto] sm:items-start">
                    <Field
                      label="Nama"
                      value={item.name}
                      onChange={(v) => update(i, { name: v })}
                      placeholder="React"
                    />
                    <Field
                      label="Slug (simpleicons)"
                      value={item.slug}
                      onChange={(v) => update(i, { slug: v })}
                      placeholder="react"
                    />
                    <Field
                      label="Warna (hex, opsional)"
                      value={item.color ?? ""}
                      onChange={(v) => update(i, { color: v })}
                      placeholder="3DDC84"
                    />
                    <Field
                      label="Emoji (opsional)"
                      value={item.emoji ?? ""}
                      onChange={(v) => update(i, { emoji: v })}
                      placeholder="⚛️"
                    />
                    <div className="flex items-start gap-1 sm:pt-6">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => move(i, -1)}
                        disabled={i === 0}
                        aria-label="Naikkan"
                      >
                        <ArrowUp className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => move(i, 1)}
                        disabled={i === items.length - 1}
                        aria-label="Turunkan"
                      >
                        <ArrowDown className="size-4" aria-hidden="true" />
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(i)}
                        aria-label="Hapus"
                        className="text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </Button>
                    </div>
                    <div className="flex items-center gap-3 sm:col-span-3">
                      <span className="flex size-9 items-center justify-center rounded-md border border-border bg-card">
                        <IconPreview slug={item.slug} color={item.color} emoji={item.emoji} />
                      </span>
                      <p className="text-xs text-muted-foreground">
                        Preview ikon dari{" "}
                        <a
                          href={`https://simpleicons.org/?q=${encodeURIComponent(item.slug)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="underline underline-offset-2"
                        >
                          simpleicons.org
                        </a>{" "}
                        — cari slug di situs itu kalau ikon tidak muncul.
                      </p>
                    </div>
                  </div>
                </Collapsible>
              </div>
            )
          })}

          {items.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Belum ada stack. Klik "Tambah" untuk menambah teknologi.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
