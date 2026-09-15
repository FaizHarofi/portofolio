import { Card, CardContent } from "@/components/ui/card"
import { EntityList } from "./fields"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { SocialLink } from "@/lib/data"

export function SocialsPage() {
  const { content, set } = useAdmin()
  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <EntityList<SocialLink>
          title="Sosial Media"
          items={content.socials}
          fields={[
            { key: "label", label: "Label" },
            { key: "href", label: "Link" },
            {
              key: "slug",
              label: "Slug (simpleicons)",
              preview: (v) => v ? `https://cdn.simpleicons.org/${v}/000000` : null,
            },
            { key: "color", label: "Warna (hex, opsional)" },
            { key: "emoji", label: "Emoji (opsional)" },
          ]}
          blank={{ label: "", href: "#", slug: "", color: "", emoji: "" }}
          onChange={(v) => set("socials", v)}
          headerRight={<SaveButton section={["socials"]} />}
        />
      </CardContent>
    </Card>
  )
}
