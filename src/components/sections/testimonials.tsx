import { BlurFade } from "@/components/magicui/blur-fade"
import { Marquee } from "@/components/magicui/marquee"
import { Card, CardContent } from "@/components/ui/card"
import { useContent } from "@/lib/content"
import type { TestimonialItem } from "@/lib/data"

function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

function TestimonialCard({ item }: { item: TestimonialItem }) {
  return (
    <Card className="h-full w-[320px] gap-0 py-0 sm:w-[360px]">
      <CardContent className="flex h-full flex-col gap-4 p-5">
        <p className="text-sm leading-relaxed text-foreground/90">"{item.quote}"</p>
        <div className="mt-auto flex items-center gap-3">
          {item.avatar ? (
            <img
              src={item.avatar}
              alt={item.name}
              loading="lazy"
              className="size-9 rounded-full object-cover"
            />
          ) : (
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
              {initialsOf(item.name)}
            </span>
          )}
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-muted-foreground">{item.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function Testimonials() {
  const { testimonials } = useContent()
  const items = testimonials ?? []

  const columns: TestimonialItem[][] = [0, 1, 2].map((column) =>
    items.filter((_, index) => index % 3 === column)
  )

  return (
    <section
      id="testimonials"
      className="scroll-mt-24 bg-card/40 py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BlurFade>
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Kind words from people I've worked with
            </h2>
            <p className="mt-3 text-muted-foreground">
              A few words from clients, teammates, and collaborators.
            </p>
          </div>
        </BlurFade>

        {items.length === 0 ? (
          <p className="mt-10 text-muted-foreground">
            No testimonials yet. Check back soon.
          </p>
        ) : (
          <>
            <div className="mt-10 grid gap-4 md:hidden">
              {items.map((item) => (
                <TestimonialCard key={`${item.name}-${item.role}`} item={item} />
              ))}
            </div>
            <div className="mt-10 hidden gap-4 md:grid md:grid-cols-3">
              {columns.map((column, columnIndex) => (
                <div
                  key={columnIndex}
                  className="h-[460px] overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]"
                >
                  <Marquee
                    vertical
                    pauseOnHover
                    repeat={3}
                    className="h-full [--duration:26s]"
                  >
                    {column.map((item) => (
                      <TestimonialCard key={`${item.name}-${item.role}`} item={item} />
                    ))}
                  </Marquee>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
