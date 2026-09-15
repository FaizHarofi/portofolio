import { useReducedMotion } from "motion/react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Globe } from "@/components/magicui/globe"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { useContent } from "@/lib/content"

export function Contact() {
  const reduce = useReducedMotion()
  const { site, socials } = useContent()

  return (
    <section id="contact" className="relative scroll-mt-24 overflow-hidden py-28">
      {!reduce && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-1/2 hidden -translate-y-1/2 lg:block"
        >
          <div className="size-[480px] opacity-70">
            <Globe className="size-full" />
          </div>
        </div>
      )}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <BlurFade>
          <h2 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
            Let's build something.
          </h2>
        </BlurFade>
        <BlurFade delay={0.08}>
          <p className="mt-4 max-w-[65ch] text-lg text-muted-foreground">
            If you want your product to feel alive, we should talk.
          </p>
        </BlurFade>
        <BlurFade delay={0.16}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <a href={`mailto:${site.email}`}>Send Email</a>
            </Button>
            {/* TODO: replace with the real booking link */}
            <Button size="lg" variant="outline" asChild>
              <a href="#">Book a Call</a>
            </Button>
            <Badge variant="secondary" className="ml-1">
              {site.availabilityNote}
            </Badge>
          </div>
        </BlurFade>
        <BlurFade delay={0.24}>
          <div className="mt-8 flex items-center gap-2">
            {socials.map((social) => (
              <Button key={social.label} variant="ghost" size="icon" asChild>
                <a href={social.href} aria-label={social.label} target="_blank" rel="noopener noreferrer">
                  <Icon slug={social.slug} color={social.color} emoji={social.emoji} className="size-5" />
                </a>
              </Button>
            ))}
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
