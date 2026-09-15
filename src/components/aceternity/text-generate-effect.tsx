import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

interface TextGenerateEffectProps {
  words: string
  className?: string
  duration?: number
  stagger?: number
}

export function TextGenerateEffect({
  words,
  className,
  duration = 0.5,
  stagger = 0.12,
}: TextGenerateEffectProps) {
  const reduce = useReducedMotion()
  const wordsArray = words.split(" ")

  return (
    <span className={cn("inline", className)}>
      {wordsArray.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          className="inline-block"
          initial={reduce ? false : { opacity: 0, filter: "blur(10px)", y: 8 }}
          whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          viewport={{ once: true, margin: "-48px" }}
          transition={{
            duration: reduce ? 0 : duration,
            delay: reduce ? 0 : index * stagger,
            ease: "easeOut",
          }}
        >
          {word}
          {index < wordsArray.length - 1 ? "\u00A0" : ""}
        </motion.span>
      ))}
    </span>
  )
}
