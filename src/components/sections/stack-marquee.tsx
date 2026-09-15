import { Icon } from "@/components/ui/icon"
import { Marquee } from "@/components/magicui/marquee"
import { useContent } from "@/lib/content"
import type { TechItem } from "@/lib/data"

function StackChip({ tech }: { tech: TechItem }) {
  return (
    <div className="flex items-center gap-3 rounded-full border border-border/60 bg-card/80 px-5 py-2.5 shadow-sm backdrop-blur-sm transition-colors hover:border-primary/40 hover:bg-primary/5">
      <Icon slug={tech.slug} color={tech.color} emoji={tech.emoji} />
      <span className="text-sm font-medium whitespace-nowrap">{tech.name}</span>
    </div>
  )
}

export function StackMarquee() {
  const { stack } = useContent()
  const items = stack ?? []
  const reversed = [...items].reverse()

  if (items.length === 0) return null

  return (
    <section aria-label="Technologies I work with" className="py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col gap-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <Marquee pauseOnHover className="[--duration:28s]">
            {items.map((tech) => (
              <StackChip key={tech.name} tech={tech} />
            ))}
          </Marquee>
          <Marquee pauseOnHover reverse className="[--duration:34s]">
            {reversed.map((tech) => (
              <StackChip key={tech.name} tech={tech} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
