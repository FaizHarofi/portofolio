import { Card, CardContent } from "@/components/ui/card"
import { EntityList } from "./fields"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { NavLink } from "@/lib/data"

export function NavPage() {
  const { content, set } = useAdmin()
  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <EntityList<NavLink>
          title="Navigasi"
          items={content.navLinks}
          fields={[
            { key: "label", label: "Label" },
            { key: "href", label: "Href" },
          ]}
          blank={{ label: "", href: "#" }}
          onChange={(v) => set("navLinks", v)}
          headerRight={<SaveButton section={["navLinks"]} />}
        />
      </CardContent>
    </Card>
  )
}
