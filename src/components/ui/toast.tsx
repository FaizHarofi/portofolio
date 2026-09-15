import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react"

type ToastType = "success" | "error" | "info"

type Toast = {
  id: number
  message: string
  type: ToastType
}

type ToastContextType = {
  toast: (message: string, type?: ToastType) => void
}

const ToastCtx = createContext<ToastContextType | null>(null)

let nextId = 0

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timers = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map())

  const remove = useCallback((id: number) => {
    timers.current.delete(id)
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = nextId++
      setToasts((prev) => [...prev, { id, message, type }])
      const timer = setTimeout(() => remove(id), 4000)
      timers.current.set(id, timer)
    },
    [remove],
  )

  useEffect(() => {
    return () => {
      for (const t of timers.current.values()) clearTimeout(t)
    }
  }, [])

  return (
    <ToastCtx.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-[9999] flex flex-col items-center gap-2 px-4">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`pointer-events-auto w-full max-w-sm rounded-lg border px-4 py-3 text-sm shadow-lg backdrop-blur-sm transition-all duration-300 animate-in slide-in-from-top-2 fade-in ${
              t.type === "success"
                ? "border-green-500/30 bg-green-900/90 text-green-100"
                : t.type === "error"
                  ? "border-red-500/30 bg-red-900/90 text-red-100"
                  : "border-border bg-card text-foreground"
            }`}
            onClick={() => remove(t.id)}
          >
            <span className="mr-2 font-semibold">
              {t.type === "success" ? "\u2713" : t.type === "error" ? "\u2717" : "\u2139"}
            </span>
            {t.message}
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastCtx)
  if (!ctx) throw new Error("useToast must be used within ToastProvider")
  return ctx
}
