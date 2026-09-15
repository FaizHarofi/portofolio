import Link from "next/link"
import { ArrowUpRight } from "lucide-react"

import { CardBody, CardContainer, CardItem } from "@/components/aceternity/3d-card"
import { BlurFade } from "@/components/magicui/blur-fade"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useContent } from "@/lib/content"

const RECENT_LIMIT = 4

export function Project() {
  const { projects } = useContent()
  const visible = projects.filter((p) => p.enabled !== false)
  const recent = visible.slice(-RECENT_LIMIT).reverse()

  return (
    <section id="project" className="scroll-mt-24 py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Project
            </h2>
            <p className="mt-3 text-muted-foreground">
              A few things I&apos;ve built recently.
            </p>
          </div>
          {visible.length > 0 && (
            <Button asChild variant="outline">
              <Link href="/projects" aria-label="Lihat semua project">
                All Project
              </Link>
            </Button>
          )}
        </div>
        {recent.length === 0 ? (
          <p className="mt-10 text-muted-foreground">
            No projects yet. Check back soon.
          </p>
        ) : (
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            {recent.map((project, index) => (
            <BlurFade key={project.title} delay={(index % 2) * 0.08} className="h-full">
              <CardContainer className="w-full" containerClassName="w-full">
                <CardBody>
                  <Card className="group h-full gap-0 overflow-hidden py-0">
                    <CardItem
                      translateZ={20}
                      className="relative aspect-[16/10] overflow-hidden"
                    >
                      <img
                        src={project.image}
                        alt={project.title}
                        loading="lazy"
                        className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </CardItem>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-4">
                        <CardItem as="h3" translateZ={30} className="text-lg font-bold">
                          {project.title}
                        </CardItem>
                        <a
                          href={project.link}
                          aria-label={`View ${project.title}`}
                          className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-primary hover:text-primary focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:outline-none active:scale-95"
                        >
                          <ArrowUpRight className="size-4" aria-hidden="true" />
                        </a>
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {project.description}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </CardBody>
              </CardContainer>
            </BlurFade>
          ))}
          </div>
        )}
      </div>
    </section>
  )
}
