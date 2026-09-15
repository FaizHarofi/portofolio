import { Save } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useAdmin } from "./state"
import type { PortfolioContent } from "@/lib/data"

export function SaveButton({ section }: { section: (keyof PortfolioContent)[] }) {
  const { saveSection, saving, saved } = useAdmin()
  return (
    <Button size="sm" onClick={() => saveSection(section)} disabled={saving}>
      <Save className="size-4" />
      {saved ? "Tersimpan" : saving ? "Menyimpan..." : "Simpan"}
    </Button>
  )
}
