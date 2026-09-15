"use client"

import { Navbar } from "@/components/sections/navbar"
import { Hero } from "@/components/sections/hero"
import { StackMarquee } from "@/components/sections/stack-marquee"
import { About } from "@/components/sections/about"
import { Career } from "@/components/sections/career"
import { Services } from "@/components/sections/services"
import { Project } from "@/components/sections/project"
import { Testimonials } from "@/components/sections/testimonials"
import { Contact } from "@/components/sections/contact"
import { Footer } from "@/components/sections/footer"

export default function Home() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <StackMarquee />
      <About />
      <Career />
      <Services />
      <Project />
      <Testimonials />
      <Contact />
      <Footer />
    </main>
  )
}
