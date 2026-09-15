import { BlurFade } from "@/components/magicui/blur-fade"
import { useContent } from "@/lib/content"

export function Career() {
  const { career } = useContent()
  const items = career ?? []

  if (items.length === 0) return null

  return (
    <section id="career" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          Perjalanan Karir
        </h2>
        <div className="relative mt-10">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-border md:left-1/2" />
          <div className="grid gap-8">
            {items.map((item, i) => (
              <BlurFade key={i} delay={i * 0.06}>
                <div
                  className={
                    "relative grid gap-3 pl-10 md:grid-cols-2 md:gap-8 md:pl-0 " +
                    (i % 2 === 0 ? "md:pr-[calc(50%+1.5rem)]" : "md:pl-[calc(50%+1.5rem)]")
                  }
                >
                  <div className="absolute left-4 top-1.5 size-3 -translate-x-1/2 rounded-full border-2 border-primary bg-background md:left-1/2" />
                  <div
                    className={
                      i % 2 === 0
                        ? "md:order-2 md:text-left"
                        : "md:order-1 md:text-right"
                    }
                  >
                    <span className="text-xs font-semibold text-primary">{item.year}</span>
                    <h3 className="mt-1 font-semibold">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
