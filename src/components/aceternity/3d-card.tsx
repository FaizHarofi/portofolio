import * as React from "react"
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"

import { cn } from "@/lib/utils"

const springConfig = { stiffness: 160, damping: 22, mass: 0.6 }

export function CardContainer({
  children,
  className,
  containerClassName,
}: {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}) {
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const reduce = useReducedMotion()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const rotateX = useSpring(
    useTransform(mouseY, [-0.5, 0.5], ["9deg", "-9deg"]),
    springConfig
  )
  const rotateY = useSpring(
    useTransform(mouseX, [-0.5, 0.5], ["-9deg", "9deg"]),
    springConfig
  )

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (reduce || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    mouseX.set((event.clientX - rect.left - rect.width / 2) / rect.width)
    mouseY.set((event.clientY - rect.top - rect.height / 2) / rect.height)
  }

  function handleMouseLeave() {
    mouseX.set(0)
    mouseY.set(0)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative flex [perspective:1400px]", containerClassName)}
    >
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn("relative w-full [transform-style:preserve-3d]", className)}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function CardBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("relative w-full [transform-style:preserve-3d]", className)}>
      {children}
    </div>
  )
}

export function CardItem({
  children,
  className,
  translateZ = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode
  className?: string
  translateZ?: number
  as?: React.ElementType
}) {
  return (
    <Tag
      className={cn("transition duration-200 ease-out", className)}
      style={{ transform: `translateZ(${translateZ}px)` }}
    >
      {children}
    </Tag>
  )
}
