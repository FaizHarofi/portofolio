import { BlurFade } from "@/components/magicui/blur-fade"
import { ShineBorder } from "@/components/magicui/shine-border"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { useContent } from "@/lib/content"

export function Services() {
  const { services } = useContent()
  const items = services ?? []

  return (
    <section
      id="services"
      className="scroll-mt-24 bg-card/40 py-24"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <BlurFade>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Services.</h2>
          <p className="mt-3 max-w-2xl text-muted-foreground">
            What I can do for your team or product.
          </p>
        </BlurFade>
        {items.length === 0 ? (
          <p className="mt-10 text-muted-foreground">
            No services yet. Check back soon.
          </p>
        ) : (
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((service, index) => (
            <BlurFade key={service.title} delay={index * 0.05} className="h-full">
              <Card className="group relative h-full gap-3 overflow-hidden bg-background/60 py-6 transition-colors hover:border-primary/40">
                <ShineBorder
                  borderWidth={1}
                  shineColor="#455CE9"
                  className="opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <CardContent className="space-y-2">
                  {service.icon || service.emoji ? (
                    <Icon slug={service.icon} color={service.color} emoji={service.emoji} />
                  ) : null}
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="text-sm text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            </BlurFade>
          ))}
        </div>
        )}
      </div>
    </section>
  )
}
