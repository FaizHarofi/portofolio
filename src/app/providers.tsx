"use client"

import { ReactNode } from "react"
import { ContentProvider } from "@/lib/content"
import { ToastProvider } from "@/components/ui/toast"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <ContentProvider>{children}</ContentProvider>
    </ToastProvider>
  )
}
