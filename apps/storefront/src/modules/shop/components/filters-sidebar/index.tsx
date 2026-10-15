import type { SearchFacetResult } from "@lib/data/search"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { clx } from "@modules/common/components/ui"
import { FACET_LABELS, FACET_ORDER, formatFacetValue } from "@modules/shop/constants"
import { toggleFacetValueHref, type ShopSearchParams } from "@modules/shop/utils/build-shop-href"

type FiltersSidebarProps = {
  facets: Record<string, SearchFacetResult>
  searchParams: ShopSearchParams
}

export default function FiltersSidebar({ facets, searchParams }: FiltersSidebarProps) {
  const fields = FACET_ORDER.filter((field) => {
    const facet = facets[field]
    return facet && facet.type === "value" && facet.values.length > 0
  })

  if (fields.length === 0) {
    return (
      <p className="text-sm text-muted">
        Nessun filtro disponibile al momento.
      </p>
    )
  }

  const activeValues = (field: string): string[] => {
    const raw = searchParams[field]
    return raw === undefined ? [] : Array.isArray(raw) ? raw : [raw]
  }

  return (
    <div className="flex flex-col gap-y-8">
      {fields.map((field) => {
        const facet = facets[field]
        if (!facet || facet.type !== "value") return null
        const active = activeValues(field)

        return (
          <div key={field}>
            <h3 className="mb-3 text-xs font-medium uppercase tracking-wide text-foreground">
              {FACET_LABELS[field]}
            </h3>
            <ul className="flex flex-col gap-y-2">
              {facet.values.map(({ value, count }) => {
                const isActive = active.includes(value)
                return (
                  <li key={value}>
                    <LocalizedClientLink
                      href={toggleFacetValueHref(searchParams, field, value)}
                      scroll={false}
                      className="flex items-center justify-between gap-x-2 text-sm text-muted hover:text-foreground"
                      aria-pressed={isActive}
                    >
                      <span className="flex items-center gap-x-2">
                        <span
                          aria-hidden
                          className={clx(
                            "flex h-4 w-4 shrink-0 items-center justify-center rounded border border-border",
                            isActive && "border-coffee bg-coffee"
                          )}
                        >
                          {isActive && (
                            <span className="h-2 w-2 rounded-sm bg-surface" />
                          )}
                        </span>
                        <span className={clx(isActive && "text-foreground")}>
                          {formatFacetValue(field, value)}
                        </span>
                      </span>
                      <span className="text-xs text-muted">{count}</span>
                    </LocalizedClientLink>
                  </li>
                )
              })}
            </ul>
          </div>
        )
      })}
    </div>
  )
}
