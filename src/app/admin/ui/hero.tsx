import { useState } from "react"
import { Pencil, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Area, Field, TagsField } from "./fields"
import { useAdmin } from "./state"

export function HeroPage() {
  const { content, set, saveSection, saving } = useAdmin()
  const hero = content.hero
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(hero)

  function startEdit() {
    setDraft({ ...hero })
    setEditing(true)
  }

  function cancelEdit() {
    setEditing(false)
  }

  async function applyDraft() {
    set("hero", draft)
    await saveSection(["hero"])
    setEditing(false)
  }

  return (
    <Card className="gap-4 py-5">
      <CardContent className="grid gap-4 px-5">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Hero</h2>
          <div className="flex items-center gap-2">
            {!editing ? (
              <Button size="sm" variant="outline" onClick={startEdit}>
                <Pencil className="size-4" />
                Edit
              </Button>
            ) : (
              <Button size="sm" variant="ghost" onClick={cancelEdit}>
                <X className="size-4" />
                Batal
              </Button>
            )}
          </div>
        </div>

        {!editing ? (
          <div className="grid gap-3 text-sm">
            <ReadOnly label="Awalan headline" value={hero.headlinePrefix} />
            <ReadOnly label="Kata berputar" value={hero.rotatingWords.join(", ")} />
            <ReadOnly label="Subtext" value={hero.subtext} />
            <div className="grid gap-3 sm:grid-cols-2">
              <ReadOnly label="CTA utama (label)" value={hero.primaryCta.label} />
              <ReadOnly label="CTA utama (href)" value={hero.primaryCta.href} />
              <ReadOnly label="CTA sekunder (label)" value={hero.secondaryCta.label} />
              <ReadOnly label="CTA sekunder (href)" value={hero.secondaryCta.href} />
            </div>
          </div>
        ) : (
          <div className="grid gap-3">
            <Field
              label="Awalan headline"
              value={draft.headlinePrefix}
              onChange={(v) => setDraft({ ...draft, headlinePrefix: v })}
            />
            <TagsField
              label="Kata berputar"
              items={draft.rotatingWords}
              onChange={(v) => setDraft({ ...draft, rotatingWords: v })}
            />
            <Area label="Subtext" value={draft.subtext} onChange={(v) => setDraft({ ...draft, subtext: v })} />
            <div className="grid gap-3 sm:grid-cols-2">
              <Field
                label="CTA utama (label)"
                value={draft.primaryCta.label}
                onChange={(v) => setDraft({ ...draft, primaryCta: { ...draft.primaryCta, label: v } })}
              />
              <Field
                label="CTA utama (href)"
                value={draft.primaryCta.href}
                onChange={(v) => setDraft({ ...draft, primaryCta: { ...draft.primaryCta, href: v } })}
              />
              <Field
                label="CTA sekunder (label)"
                value={draft.secondaryCta.label}
                onChange={(v) => setDraft({ ...draft, secondaryCta: { ...draft.secondaryCta, label: v } })}
              />
              <Field
                label="CTA sekunder (href)"
                value={draft.secondaryCta.href}
                onChange={(v) => setDraft({ ...draft, secondaryCta: { ...draft.secondaryCta, href: v } })}
              />
            </div>
            <div className="flex justify-end">
              <Button size="sm" onClick={applyDraft} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
            </div>
          </div>
        )}
      </CardContent>
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
