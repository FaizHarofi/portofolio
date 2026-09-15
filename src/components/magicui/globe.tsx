"use client"

import { useEffect, useRef } from "react"
import createGlobe, { type COBEOptions } from "cobe"
import { useMotionValue, useSpring } from "motion/react"

import { cn } from "@/lib/utils"

const MOVEMENT_DAMPING = 1400

const GLOBE_CONFIG = {
  width: 800,
  height: 800,
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [1, 1, 1],
  markerColor: [0, 0, 0],
  glowColor: [1, 1, 1],
  markers: [],
} satisfies COBEOptions

export function Globe({
  className,
  config = GLOBE_CONFIG,
}: {
  className?: string
  config?: typeof GLOBE_CONFIG
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const phiRef = useRef(0)
  const pointerInteracting = useRef<number | null>(null)
  const pointerInteractionMovement = useRef(0)

  const r = useMotionValue(0)
  const rs = useSpring(r, {
    mass: 1,
    damping: 30,
    stiffness: 100,
  })

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab"
    }
  }

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current
      pointerInteractionMovement.current = delta
      r.set(r.get() + delta / MOVEMENT_DAMPING)
    }
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const onResize = () => {
      const width = canvas.offsetWidth
      canvas.style.width = `${width}px`
      canvas.style.height = `${width}px`
    }

    window.addEventListener("resize", onResize)
    onResize()

    const width = canvas.offsetWidth
    const globe = createGlobe(canvas, {
      ...config,
      width: width * 2,
      height: width * 2,
    })

    let raf: number
    const tick = () => {
      if (!pointerInteracting.current) {
        phiRef.current += 0.005
      }
      globe.update({
        phi: phiRef.current + rs.get(),
      })
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    setTimeout(() => {
      canvas.style.opacity = "1"
    }, 0)

    return () => {
      cancelAnimationFrame(raf)
      globe.destroy()
      window.removeEventListener("resize", onResize)
    }
  }, [config, rs])

  return (
    <div
      className={cn(
        "absolute inset-0 mx-auto aspect-square w-full max-w-150",
        className
      )}
    >
      <canvas
        className={cn(
          "size-full opacity-0 transition-opacity duration-500 contain-[layout_paint_size]"
        )}
        ref={canvasRef}
        onPointerDown={(e) => {
          pointerInteracting.current = e.clientX
          updatePointerInteraction(e.clientX)
        }}
        onPointerUp={() => updatePointerInteraction(null)}
        onPointerOut={() => updatePointerInteraction(null)}
        onMouseMove={(e) => updateMovement(e.clientX)}
        onTouchMove={(e) =>
          e.touches[0] && updateMovement(e.touches[0].clientX)
        }
      />
    </div>
  )
}
