import { Card, CardContent } from "@/components/ui/card"
import { EntityList } from "./fields"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { RoleItem } from "@/lib/data"

export function RolesPage() {
  const { content, set } = useAdmin()
  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <EntityList<RoleItem>
          title="Peran (About)"
          items={content.roles}
          fields={[
            { key: "title", label: "Judul" },
            { key: "description", label: "Deskripsi", type: "area" },
            { key: "icon", label: "Ikon (slug simpleicons, cth: react)" },
            { key: "color", label: "Warna ikon (hex, opsional)" },
            { key: "emoji", label: "Emoji (opsional)" },
          ]}
          blank={{ title: "", description: "", icon: "", color: "", emoji: "" }}
          onChange={(v) => set("roles", v)}
          headerRight={<SaveButton section={["roles"]} />}
        />
      </CardContent>
    </Card>
  )
}
