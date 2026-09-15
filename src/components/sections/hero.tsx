import { useEffect, useState } from "react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { MapPin } from "lucide-react"

import { BlurFade } from "@/components/magicui/blur-fade"
import { Particles } from "@/components/magicui/particles"
import { Button } from "@/components/ui/button"
import { useContent } from "@/lib/content"

export function Hero() {
  const reduce = useReducedMotion()
  const { hero, site } = useContent()
  const [wordIndex, setWordIndex] = useState(0)

  useEffect(() => {
    if (reduce) return
    const id = window.setInterval(() => {
      setWordIndex((index) => (index + 1) % hero.rotatingWords.length)
    }, 2600)
    return () => window.clearInterval(id)
  }, [reduce, hero.rotatingWords.length])

  return (
    <section
      id="top"
      className="relative flex min-h-[100dvh] items-center overflow-hidden pt-16"
    >
      {!reduce && (
        <Particles
          className="absolute inset-0"
          quantity={40}
          size={0.4}
          ease={60}
          staticity={40}
          color="#455CE9"
        />
      )}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 [background:radial-gradient(60%_50%_at_50%_0%,color-mix(in_srgb,var(--primary)_10%,transparent),transparent_70%)]"
      />
      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6">
        <BlurFade>
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="relative flex size-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {site.availability}
          </span>
        </BlurFade>

        <BlurFade delay={0.04}>
          <p className="mt-6 text-2xl font-extrabold tracking-tight sm:text-3xl">
            Hi, I&apos;m {site.name}
          </p>
        </BlurFade>

        <BlurFade delay={0.08}>
          <h1 className="mt-6 max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
            {hero.headlinePrefix}{" "}
            <span className="inline-block text-primary">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={hero.rotatingWords[wordIndex]}
                  initial={reduce ? false : { y: "70%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={reduce ? undefined : { y: "-70%", opacity: 0 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-block"
                >
                  {hero.rotatingWords[wordIndex]}
                </motion.span>
              </AnimatePresence>
            </span>
          </h1>
        </BlurFade>

        <BlurFade delay={0.16}>
          <p className="mt-5 max-w-[65ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
            {hero.subtext}
          </p>
        </BlurFade>

        <BlurFade delay={0.24}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button size="lg" asChild>
              <a href={hero.primaryCta.href}>{hero.primaryCta.label}</a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href={hero.secondaryCta.href}>{hero.secondaryCta.label}</a>
            </Button>
            <span className="ml-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="size-4" aria-hidden="true" />
              {site.location}
            </span>
          </div>
        </BlurFade>
      </div>
    </section>
  )
}
