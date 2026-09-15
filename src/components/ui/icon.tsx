export function Icon({
  slug,
  color,
  emoji,
  className,
}: {
  slug?: string
  color?: string
  emoji?: string
  className?: string
}) {
  if (emoji) {
    return (
      <span className={className ?? "size-5"} role="img" aria-hidden="true">
        {emoji}
      </span>
    )
  }

  if (!slug) return null

  return (
    <img
      src={
        color
          ? `https://cdn.simpleicons.org/${slug}/${color}`
          : `https://cdn.simpleicons.org/${slug}/000000`
      }
      alt=""
      aria-hidden="true"
      loading="lazy"
      className={`${className ?? "size-5"} ${color ? "" : "dark:invert"}`}
    />
  )
}
