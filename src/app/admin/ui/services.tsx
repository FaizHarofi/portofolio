import { Card, CardContent } from "@/components/ui/card"
import { EntityList } from "./fields"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { ServiceItem } from "@/lib/data"

export function ServicesPage() {
  const { content, set } = useAdmin()
  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <EntityList<ServiceItem>
          title="Layanan"
          items={content.services}
          fields={[
            { key: "title", label: "Judul" },
            { key: "description", label: "Deskripsi", type: "area" },
            {
              key: "icon",
              label: "Ikon (slug simpleicons, cth: react)",
              preview: (v) => v ? `https://cdn.simpleicons.org/${v}/000000` : null,
            },
            { key: "color", label: "Warna ikon (hex, opsional)" },
            { key: "emoji", label: "Emoji (opsional)" },
          ]}
          blank={{ title: "", description: "", icon: "", color: "", emoji: "" }}
          onChange={(v) => set("services", v)}
          headerRight={<SaveButton section={["services"]} />}
        />
      </CardContent>
    </Card>
  )
}
