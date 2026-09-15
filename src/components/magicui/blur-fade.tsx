import * as React from "react"
import { motion, useReducedMotion, type Variants } from "motion/react"

import { cn } from "@/lib/utils"

interface BlurFadeProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  yOffset?: number
  once?: boolean
}

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.6,
  yOffset = 16,
  once = true,
}: BlurFadeProps) {
  const reduce = useReducedMotion()
  const variants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: reduce ? "blur(0px)" : "blur(8px)" },
    visible: { y: 0, opacity: 1, filter: "blur(0px)" },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin: "-48px" }}
      variants={variants}
      transition={{
        duration: reduce ? 0 : duration,
        delay: reduce ? 0 : delay,
        ease: [0.21, 0.47, 0.32, 0.98],
      }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  )
}
