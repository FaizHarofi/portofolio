export interface NavLink {
  label: string
  href: string
}

export interface TechItem {
  name: string
  slug: string
  color?: string
  emoji?: string
}

export interface RoleItem {
  title: string
  description: string
  icon: string
  color?: string
  emoji?: string
}

export interface ServiceItem {
  title: string
  description: string
  icon: string
  color?: string
  emoji?: string
}

export interface ProjectItem {
  title: string
  description: string
  image: string
  tags: string[]
  link: string
  enabled?: boolean
}

export interface TestimonialItem {
  name: string
  role: string
  quote: string
  avatar?: string
}

export interface SocialLink {
  label: string
  href: string
  slug: string
  color?: string
  emoji?: string
}

export interface CareerItem {
  year: string
  title: string
  description: string
}

export const site = {
  name: "PORTFOLIO",
  email: "hello@example.com",
  availability: "Available for freelance",
  availabilityNote: "Remote Worldwide",
  location: "Based in Jakarta",
}

export const navLinks: NavLink[] = [
  { label: "About", href: "#about" },
  { label: "Project", href: "#project" },
  { label: "Services", href: "#services" },
  { label: "Testimonials", href: "#testimonials" },
  { label: "Contact", href: "#contact" },
]

export const hero = {
  headlinePrefix: "I craft digital",
  rotatingWords: ["experiences.", "interfaces.", "products.", "websites."],
  subtext:
    "I'm a developer crafting interfaces that feel alive, from clean code to considered motion.",
  primaryCta: { label: "View Work", href: "#project" },
  secondaryCta: { label: "Let's Talk", href: "#contact" },
}

export const stack: TechItem[] = []

export const roles: RoleItem[] = []

export const services: ServiceItem[] = []

export const projects: ProjectItem[] = []

export const testimonials: TestimonialItem[] = []

export const socials: SocialLink[] = []

export const about = {
  paragraphs: [
    "I don't just write code. I design and build digital experiences that feel fast, intuitive and alive, from the first wireframe to the final polish.",
    "Based in Jakarta and working with teams worldwide, I turn complex problems into clean interfaces with React and TypeScript, and I treat motion as part of the interface rather than decoration on top of it.",
  ],
}

export const career: CareerItem[] = []

export const defaultContent = {
  site,
  navLinks,
  hero,
  stack,
  roles,
  services,
  projects,
  testimonials,
  socials,
  about,
  career,
}

export type PortfolioContent = typeof defaultContent
