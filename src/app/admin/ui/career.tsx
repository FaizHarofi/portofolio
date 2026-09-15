import { useState } from "react"
import { ChevronDown, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Collapsible, Field, Area } from "./fields"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { CareerItem } from "@/lib/data"

export function CareerPage() {
  const { content, set } = useAdmin()
  const items = content.career ?? []
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  function update(index: number, patch: Partial<CareerItem>) {
    set(
      "career",
      items.map((it, i) => (i === index ? { ...it, ...patch } : it))
    )
  }

  function remove(index: number) {
    set(
      "career",
      items.filter((_, i) => i !== index)
    )
    setOpenIdx(null)
  }

  function add() {
    const next = [...items, { year: "", title: "", description: "" }]
    set("career", next)
    setOpenIdx(next.length - 1)
  }

  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold">Perjalanan Karir</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} entri — klik baris untuk edit.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <SaveButton section={["career"]} />
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
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">
                      {item.year || "(tanpa tahun)"} — {item.title || "(tanpa judul)"}
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
                  <div className="grid gap-3 px-4 pb-4 pt-1 sm:grid-cols-2">
                    <Field
                      label="Tahun"
                      value={item.year}
                      onChange={(v) => update(i, { year: v })}
                      placeholder="2022"
                    />
                    <Field
                      label="Judul"
                      value={item.title}
                      onChange={(v) => update(i, { title: v })}
                      placeholder="Frontend Developer di ..."
                    />
                    <div className="sm:col-span-2">
                      <Area
                        label="Deskripsi"
                        value={item.description}
                        onChange={(v) => update(i, { description: v })}
                      />
                    </div>
                    <div className="sm:col-span-2 flex justify-end">
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
                  </div>
                </Collapsible>
              </div>
            )
          })}

          {items.length === 0 && (
            <p className="px-4 py-6 text-center text-sm text-muted-foreground">
              Belum ada data karir. Klik "Tambah" untuk menambah entri.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
