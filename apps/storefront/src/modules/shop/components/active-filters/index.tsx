import { XMark } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { FACET_LABELS, FACET_ORDER, formatFacetValue } from "@modules/shop/constants"
import {
  clearAllFiltersHref,
  removeFacetValueHref,
  type ShopSearchParams,
} from "@modules/shop/utils/build-shop-href"

export default function ActiveFilters({
  searchParams,
}: {
  searchParams: ShopSearchParams
}) {
  const chips = FACET_ORDER.flatMap((field) => {
    const raw = searchParams[field]
    const values = raw === undefined ? [] : Array.isArray(raw) ? raw : [raw]
    return values.map((value) => ({ field, value }))
  })

  if (chips.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap items-center gap-2" data-testid="active-filters">
      {chips.map(({ field, value }) => (
        <LocalizedClientLink
          key={`${field}-${value}`}
          href={removeFacetValueHref(searchParams, field, value)}
          scroll={false}
          className="flex items-center gap-x-1.5 rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-foreground hover:border-coffee"
        >
          <span>
            {FACET_LABELS[field]}: {formatFacetValue(field, value)}
          </span>
          <XMark className="h-3 w-3" />
        </LocalizedClientLink>
      ))}
      <LocalizedClientLink
        href={clearAllFiltersHref(searchParams, FACET_ORDER)}
        scroll={false}
        className="text-xs text-muted underline hover:text-coffee"
      >
        Azzera filtri
      </LocalizedClientLink>
    </div>
  )
}
