"use client"

import { Navbar } from "@/components/sections/navbar"
import { Footer } from "@/components/sections/footer"
import { useContent } from "@/lib/content"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"
import { BlurFade } from "@/components/magicui/blur-fade"
import { CardBody, CardContainer, CardItem } from "@/components/aceternity/3d-card"
import type { ProjectItem } from "@/lib/data"

export default function ProjectsPage() {
  const content = useContent()
  const projects = content.projects.filter((p: ProjectItem) => p.enabled !== false).reverse()

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <section className="pt-28 pb-20 px-4">
        <div className="max-w-6xl mx-auto">
          <BlurFade delay={0.1}>
            <h2 className="text-3xl font-bold mb-8">All Projects</h2>
          </BlurFade>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project: ProjectItem, i: number) => (
              <BlurFade key={project.title} delay={0.2 + i * 0.1}>
                <CardContainer>
                  <CardBody className="relative group/card">
                    <CardItem translateZ={50}>
                      <Card className="overflow-hidden h-full">
                        {project.image && (
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-full h-full object-cover group-hover/card:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4 space-y-3">
                          <h3 className="font-semibold text-lg">{project.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                          <div className="flex flex-wrap gap-1.5">
                            {project.tags.map((tag: string) => (
                              <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          {project.link && (
                            <a
                              href={project.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                            >
                              View Project <ArrowUpRight className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </Card>
                    </CardItem>
                  </CardBody>
                </CardContainer>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  )
}
