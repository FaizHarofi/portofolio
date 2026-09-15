import { useState } from "react"
import { ArrowDown, ArrowUp, ChevronDown, Plus, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function Collapsible({ open, children }: { open: boolean; children: React.ReactNode }) {
  return (
    <div
      className="grid transition-[grid-template-rows] duration-200 ease-out"
      style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
    >
      <div className="overflow-hidden">{children}</div>
    </div>
  )
}

export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
  placeholder?: string
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  )
}

export function Area({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <Textarea value={value} rows={2} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export function TagsField({
  label,
  items,
  onChange,
}: {
  label: string
  items: string[]
  onChange: (v: string[]) => void
}) {
  const set = (i: number, v: string) => onChange(items.map((it, idx) => (idx === i ? v : it)))
  const add = () => onChange([...items, ""])
  const remove = (i: number) => onChange(items.filter((_, idx) => idx !== i))
  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= items.length) return
    const next = items.slice()
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }
  return (
    <div className="grid gap-1.5">
      <Label>{label}</Label>
      <div className="grid gap-2">
        {items.map((it, i) => (
          <div key={i} className="flex gap-2">
            <Input value={it} onChange={(e) => set(i, e.target.value)} />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => move(i, -1)}
              aria-label={`Naikkan ${label} ${i + 1}`}
              disabled={i === 0}
            >
              <ArrowUp className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => move(i, 1)}
              aria-label={`Turunkan ${label} ${i + 1}`}
              disabled={i === items.length - 1}
            >
              <ArrowDown className="size-4" />
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => remove(i)}
              aria-label={`Hapus ${label} ${i + 1}`}
            >
              <Trash2 className="size-4" />
            </Button>
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={add} className="w-fit">
          <Plus className="size-4" /> Tambah
        </Button>
      </div>
    </div>
  )
}

export type FieldDef = {
  key: string
  label: string
  type?: "text" | "area" | "list"
  preview?: (value: string) => string | null
}

export function EntityList<T extends object>({
  title,
  items,
  fields,
  blank,
  onChange,
  headerRight,
}: {
  title: string
  items: T[]
  fields: FieldDef[]
  blank: T
  onChange: (items: T[]) => void
  headerRight?: React.ReactNode
}) {
  const [openIdx, setOpenIdx] = useState<number | null>(null)

  const update = (i: number, key: string, value: unknown) =>
    onChange(items.map((it, idx) => (idx === i ? ({ ...it, [key]: value } as T) : it)))
  const add = () => {
    onChange([...items, blank])
    setOpenIdx(items.length)
  }
  const remove = (i: number) => {
    onChange(items.filter((_, idx) => idx !== i))
    setOpenIdx(null)
  }

  function itemLabel(item: T) {
    const record = item as unknown as Record<string, unknown>
    const first = fields[0]
    if (!first) return `#${items.indexOf(item) + 1}`
    const val = String(record[first.key] ?? "").trim()
    return val || `(tanpa ${first.label.toLowerCase()})`
  }

  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <div className="flex items-center gap-2">
          {headerRight}
          <span className="rounded-md bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
            {items.length}
          </span>
        </div>
      </div>
      <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
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
                <span className="min-w-0 flex-1 truncate text-sm font-medium">
                  {itemLabel(item)}
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
                <div className="grid gap-3 px-4 pb-4 pt-1">
                  {fields.map((f) =>
                    f.type === "area" ? (
                      <Area
                        key={f.key}
                        label={f.label}
                        value={String((item as unknown as Record<string, unknown>)[f.key] ?? "")}
                        onChange={(v) => update(i, f.key, v)}
                      />
                    ) : f.type === "list" ? (
                      <TagsField
                        key={f.key}
                        label={f.label}
                        items={((item as unknown as Record<string, unknown>)[f.key] as string[]) ?? []}
                        onChange={(v) => update(i, f.key, v)}
                      />
                    ) : (
                      <div key={f.key} className="grid gap-1.5">
                        <Label>{f.label}</Label>
                        <div className="flex items-center gap-2">
                          {f.preview && (
                            <img
                              src={f.preview(String((item as unknown as Record<string, unknown>)[f.key] ?? "")) ?? ""}
                              alt=""
                              aria-hidden="true"
                              className="size-5 shrink-0 dark:invert"
                            />
                          )}
                          <Input
                            value={String((item as unknown as Record<string, unknown>)[f.key] ?? "")}
                            onChange={(e) => update(i, f.key, e.target.value)}
                          />
                        </div>
                      </div>
                    )
                  )}
                  <div className="flex justify-end">
                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(i)}>
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </div>
              </Collapsible>
            </div>
          )
        })}
        {items.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted-foreground">
            Belum ada data. Klik "Tambah" untuk menambah.
          </p>
        )}
      </div>
      <Button type="button" variant="outline" onClick={add} className="w-fit">
        <Plus className="size-4" /> Tambah {title}
      </Button>
    </div>
  )
}
