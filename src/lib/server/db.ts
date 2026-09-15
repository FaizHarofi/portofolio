import { createClient } from "@supabase/supabase-js"
import { readFileSync, writeFileSync, existsSync, copyFileSync } from "fs"
import path from "path"

const DATA_FILE = path.join(process.cwd(), ".portfolio-data.json")
const SUPABASE_URL = process.env.SUPABASE_URL || ""
const SUPABASE_KEY = process.env.SUPABASE_SECRET_KEY || ""
const supabase = SUPABASE_URL && SUPABASE_KEY ? createClient(SUPABASE_URL, SUPABASE_KEY) : null

const SEED = {
  site: {
    name: "PORTFOLIO",
    email: "hello@example.com",
    availability: "Available for freelance",
    availabilityNote: "Remote Worldwide",
    location: "Based in Jakarta",
  },
  navLinks: [
    { label: "About", href: "#about" },
    { label: "Project", href: "#project" },
    { label: "Services", href: "#services" },
    { label: "Testimonials", href: "#testimonials" },
    { label: "Contact", href: "#contact" },
  ],
  hero: {
    name: "Nama Saya",
    headlinePrefix: "I build",
    rotatingWords: ["lively", "useful", "fast", "delightful"],
    subtext: "Front-end engineer crafting thoughtful products with React, TypeScript and Motion.",
    primaryCta: { label: "View Project", href: "#project" },
    secondaryCta: { label: "About Me", href: "#about" },
  },
  stack: [],
  roles: [],
  services: [],
  projects: [],
  testimonials: [],
  socials: [],
  about: {
    paragraphs: [
      "I don't just write code. I design and build digital experiences that feel fast, intuitive and alive, from the first wireframe to the final polish.",
      "Based in Jakarta and working with teams worldwide, I turn complex problems into clean interfaces with React and TypeScript, and I treat motion as part of the interface rather than decoration on top of it.",
    ],
  },
  career: [],
}

function withDefaults(content: Record<string, unknown>): typeof SEED {
  if (!content || typeof content !== "object") return { ...SEED }
  const merged: Record<string, unknown> = { ...SEED, ...content }
  for (const key of Object.keys(SEED)) {
    const seedValue = (SEED as Record<string, unknown>)[key]
    const value = merged[key]
    if (
      value && typeof value === "object" && !Array.isArray(value) &&
      seedValue && typeof seedValue === "object" && !Array.isArray(seedValue)
    ) {
      merged[key] = { ...(seedValue as object), ...(value as object) }
    }
  }
  return merged as typeof SEED
}

async function loadFromSupabase(): Promise<Record<string, unknown> | null> {
  if (!supabase) return null
  try {
    const { data, error } = await supabase
      .from("content").select("data").eq("id", "site").single()
    if (error) throw error
    return (data as { data?: Record<string, unknown> })?.data ?? null
  } catch (err) {
    console.error("[supabase] load failed:", (err as Error).message)
    return null
  }
}

async function saveToSupabase(content: Record<string, unknown>): Promise<boolean> {
  if (!supabase) return false
  try {
    const { error } = await supabase
      .from("content")
      .upsert({ id: "site", data: content, updated_at: new Date().toISOString() }, { onConflict: "id" })
    if (error) throw error
    return true
  } catch (err) {
    console.error("[supabase] save failed:", (err as Error).message)
    return false
  }
}

function loadFromFile(): Record<string, unknown> {
  try {
    if (!existsSync(DATA_FILE)) {
      writeFileSync(DATA_FILE, JSON.stringify(SEED, null, 2))
      copyFileSync(DATA_FILE, `${DATA_FILE}.bak`)
    }
    return JSON.parse(readFileSync(DATA_FILE, "utf8"))
  } catch (err) {
    console.error("[storage:file] load failed, falling back to SEED:", err)
    return { ...SEED }
  }
}

function saveToFile(content: Record<string, unknown>): void {
  try {
    if (existsSync(DATA_FILE)) copyFileSync(DATA_FILE, `${DATA_FILE}.bak`)
    writeFileSync(DATA_FILE, JSON.stringify(content, null, 2))
  } catch (err) {
    console.error("[storage:file] save failed:", (err as Error).message)
    throw err
  }
}

export async function loadContent(): Promise<{ content: typeof SEED; source: string }> {
  const remote = await loadFromSupabase()
  if (remote) return { content: withDefaults(remote), source: "supabase" }
  return { content: withDefaults(loadFromFile()), source: "file" }
}

export async function saveContent(partial: Record<string, unknown>): Promise<void> {
  const { content: existing } = await loadContent()
  const merged = { ...existing, ...partial }
  saveToFile(merged)
  await saveToSupabase(merged).catch(() => {})
}
