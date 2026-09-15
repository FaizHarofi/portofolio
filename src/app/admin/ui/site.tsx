import { useState } from "react"
import { Pencil } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Field } from "./fields"
import { useAdmin } from "./state"

export function SitePage() {
  const { content, set, saveSection, saving } = useAdmin()
  const site = content.site
  const [open, setOpen] = useState(false)
  const [draft, setDraft] = useState(site)

  function openEdit() {
    setDraft({ ...site })
    setOpen(true)
  }

  async function applyDraft() {
    set("site", draft)
    await saveSection(["site"])
    setOpen(false)
  }

  return (
    <Card className="gap-4 py-5">
      <CardContent className="grid gap-4 px-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Identitas Situs</h2>
          <Button size="sm" variant="outline" onClick={openEdit}>
            <Pencil className="size-4" />
            Edit
          </Button>
        </div>
        <div className="grid gap-3 text-sm sm:grid-cols-2">
          <ReadOnly label="Nama" value={site.name} />
          <ReadOnly label="Email" value={site.email} />
          <ReadOnly label="Status Ketersediaan" value={site.availability} />
          <ReadOnly label="Catatan Ketersediaan" value={site.availabilityNote} />
          <ReadOnly label="Lokasi" value={site.location} />
        </div>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Identitas Situs</DialogTitle>
          </DialogHeader>
          <div className="grid gap-3">
            <Field label="Nama" value={draft.name} onChange={(v) => setDraft({ ...draft, name: v })} />
            <Field label="Email" value={draft.email} onChange={(v) => setDraft({ ...draft, email: v })} />
            <Field label="Status Ketersediaan" value={draft.availability} onChange={(v) => setDraft({ ...draft, availability: v })} />
            <Field label="Catatan Ketersediaan" value={draft.availabilityNote} onChange={(v) => setDraft({ ...draft, availabilityNote: v })} />
            <Field label="Lokasi" value={draft.location} onChange={(v) => setDraft({ ...draft, location: v })} />
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

function ReadOnly({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid gap-1">
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="rounded-md border border-transparent px-3 py-2 text-sm bg-muted/30">{value || "—"}</span>
    </div>
  )
}
