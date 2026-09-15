import { useState } from "react"
import { Pencil, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Area } from "./fields"
import { useAdmin } from "./state"

export function AboutPage() {
  const { content, set, saveSection, saving } = useAdmin()
  const paragraphs = content.about?.paragraphs ?? []
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState<string[]>(paragraphs)

  function openEdit() {
    setDraft([...paragraphs])
    setOpen(true)
  }

  async function applyDraft() {
    set("about", { paragraphs: draft })
    await saveSection(["about"])
    setOpen(false)
  }

  function updateDraftParagraph(index: number, value: string) {
    setDraft(draft.map((p, i) => (i === index ? value : p)))
  }

  function addDraftParagraph() {
    setDraft([...draft, ""])
  }

  function removeDraftParagraph(index: number) {
    setDraft(draft.filter((_, i) => i !== index))
  }

  return (
    <Card className="gap-4 py-5">
      <CardContent className="grid gap-4 px-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Tentang Saya</h2>
            <p className="text-sm text-muted-foreground">
              {paragraphs.length} paragraf
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={openEdit}>
              <Pencil className="size-4" />
              Edit
            </Button>
          </div>
        </div>
        <div className="grid gap-3">
          {paragraphs.length === 0 ? (
            <p className="text-sm text-muted-foreground italic">
              Belum ada paragraf. Klik Edit untuk menambah.
            </p>
          ) : (
            paragraphs.map((p, i) => (
              <div key={i} className="rounded-lg border border-border bg-muted/30 px-4 py-3">
                <p className="text-sm leading-relaxed text-foreground/80">{p}</p>
              </div>
            ))
          )}
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Edit Tentang Saya</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            {draft.map((p, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex-1">
                  <Area
                    label={`Paragraf ${i + 1}`}
                    value={p}
                    onChange={(v) => updateDraftParagraph(i, v)}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeDraftParagraph(i)}
                  className="mt-6 shrink-0 rounded-md p-1 text-destructive hover:bg-destructive/10"
                  aria-label="Hapus paragraf"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDraftParagraph}
              className="w-fit rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted"
            >
              + Tambah Paragraf
            </button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Batal</Button>
            <Button onClick={applyDraft} disabled={saving}>
              {saving ? "Menyimpan..." : "Simpan"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
