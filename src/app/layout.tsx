import type { Metadata } from "next"
import "@fontsource-variable/plus-jakarta-sans"
import "./globals.css"
import { Providers } from "./providers"

export const metadata: Metadata = {
  title: "Portfolio",
  description: "Front-end engineer crafting thoughtful products with React, TypeScript and Motion.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
