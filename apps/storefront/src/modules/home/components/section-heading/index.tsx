import { clx } from "@modules/common/components/ui"

type SectionHeadingProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: "left" | "center"
  action?: React.ReactNode
  className?: string
}

export default function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  action,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={clx(
        "flex flex-col gap-y-3 mb-10 small:mb-14",
        align === "center" && "items-center text-center",
        action && "small:flex-row small:items-end small:justify-between",
        className
      )}
    >
      <div className={clx(align === "center" && "flex flex-col items-center")}>
        {eyebrow && (
          <span className="text-xs uppercase tracking-[0.2em] text-coffee font-medium">
            {eyebrow}
          </span>
        )}
        <h2 className="mt-2 font-display text-3xl font-medium italic text-foreground tracking-tight small:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="mt-3 max-w-xl text-muted text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
