import { Card, CardContent } from "@/components/ui/card"
import { EntityList } from "./fields"
import { SaveButton } from "./save-button"
import { useAdmin } from "./state"
import type { TestimonialItem } from "@/lib/data"

export function TestimonialsPage() {
  const { content, set } = useAdmin()
  return (
    <Card className="gap-4 py-5">
      <CardContent className="px-5">
        <EntityList<TestimonialItem>
          title="Testimoni"
          items={content.testimonials}
          fields={[
            { key: "name", label: "Nama" },
            { key: "role", label: "Peran" },
            { key: "quote", label: "Quote", type: "area" },
            { key: "avatar", label: "URL avatar (opsional)" },
          ]}
          blank={{ name: "", role: "", quote: "", avatar: "" }}
          onChange={(v) => set("testimonials", v)}
          headerRight={<SaveButton section={["testimonials"]} />}
        />
      </CardContent>
    </Card>
  )
}
