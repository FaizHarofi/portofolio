import { Card, CardContent } from "@/components/ui/card"
import { EntityList } from "./fields"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { ProjectItem } from "@/lib/data"

export function ProjectsPage() {
  const { content, set } = useAdmin()
  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <EntityList<ProjectItem>
          title="Proyek"
          items={content.projects}
          fields={[
            { key: "title", label: "Judul" },
            { key: "description", label: "Deskripsi", type: "area" },
            { key: "image", label: "URL gambar (atau path dari /api/upload)" },
            { key: "link", label: "Link" },
            { key: "tags", label: "Tag", type: "list" },
            { key: "enabled", label: "Enabled (true / false)" },
          ]}
          blank={{ title: "", description: "", image: "", link: "#", tags: [], enabled: true }}
          onChange={(v) => set("projects", v)}
          headerRight={<SaveButton section={["projects"]} />}
        />
      </CardContent>
    </Card>
  )
}
