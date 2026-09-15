import { useReducedMotion } from "motion/react"

import { TextGenerateEffect } from "@/components/aceternity/text-generate-effect"
import { BlurFade } from "@/components/magicui/blur-fade"
import { BackgroundBeams } from "@/components/ui/background-beams"
import { Card, CardContent } from "@/components/ui/card"
import { Icon } from "@/components/ui/icon"
import { useContent } from "@/lib/content"

export function About() {
  const reduce = useReducedMotion()
  const { roles, about } = useContent()
  const paragraphs = about?.paragraphs ?? []
  const items = roles ?? []

  if (paragraphs.length === 0 && items.length === 0) return null

  return (
    <section id="about" className="relative scroll-mt-24 overflow-hidden py-24">
      {!reduce && <BackgroundBeams className="opacity-70" />}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
          <TextGenerateEffect words="This is what I do." />
        </h2>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          {paragraphs.length > 0 && (
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              {paragraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          )}
          {items.length > 0 && (
            <div className="grid gap-4 sm:grid-cols-2">
              {items.map((role, index) => (
                <BlurFade key={role.title} delay={index * 0.06} className="h-full">
                  <Card className="h-full gap-3 py-5">
                    <CardContent className="space-y-2 px-5">
                      {role.icon || role.emoji ? (
                        <Icon slug={role.icon} color={role.color} emoji={role.emoji} />
                      ) : null}
                      <h3 className="font-semibold">{role.title}</h3>
                      <p className="text-sm text-muted-foreground">{role.description}</p>
                    </CardContent>
                  </Card>
                </BlurFade>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
