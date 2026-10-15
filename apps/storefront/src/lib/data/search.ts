import { sdk } from "@lib/config"

export type SearchFacetValue = { value: string; count: number }

export type SearchFacetResult =
  | { type: "value"; values: SearchFacetValue[]; other_count?: number }
  | {
      type: "range"
      ranges: { key: string; from?: number | string; to?: number | string; count: number }[]
    }
  | { type: "stats"; min: number; max: number; avg?: number; sum?: number; count: number }

export type SearchHit<T = Record<string, unknown>> = {
  id: string
  score?: number
  document: T
}

export type SearchResponse<T = Record<string, unknown>> = {
  results: {
    hits: SearchHit<T>[]
    facets?: Record<string, SearchFacetResult>
    metadata: {
      skip: number
      take: number
      count: number | null
    }
  }[]
}

export const EYEWEAR_FACET_FIELDS = [
  "brand",
  "gender",
  "frame_shape",
  "frame_material",
  "frame_color",
  "lens_type",
  "polarized",
] as const

export type EyewearFacetField = (typeof EYEWEAR_FACET_FIELDS)[number]

export type ProductSearchFilters = Partial<
  Record<EyewearFacetField, string | string[] | boolean>
>

export type ProductSort = "relevance" | "price_asc" | "price_desc"

// The "product" search index caps results at this many hits per request
// (engine-side MAX_SEARCH_TAKE). Price sort isn't a field on the index
// (prices live on variants, not the search document), so for price sorting
// the caller fetches up to this many matching ids, hydrates real prices via
// `listProducts`, sorts client-side, then paginates — the same compromise
// `listProductsWithSort` already makes for category/collection pages.
export const MAX_CATALOG_RESULTS = 100

type SearchProductsInput = {
  filters?: ProductSearchFilters
}

const buildFilters = (filters?: ProductSearchFilters) => {
  if (!filters) return undefined

  const entries = Object.entries(filters).filter(
    ([, value]) =>
      value !== undefined &&
      value !== null &&
      !(Array.isArray(value) && value.length === 0)
  )

  if (entries.length === 0) {
    return undefined
  }

  return entries.reduce<Record<string, unknown>>((acc, [field, value]) => {
    acc[field] = Array.isArray(value) ? { $in: value } : value
    return acc
  }, {})
}

/**
 * Searches the "product" index for matching ids + eyewear facet counts.
 * Does not return pricing or images — the caller hydrates real product data
 * for the matched ids via `listProducts`.
 */
export const searchProducts = async ({ filters }: SearchProductsInput) => {
  const body: Record<string, unknown> = {
    entity: "product",
    fields: ["id"],
    filters: buildFilters(filters),
    pagination: {
      skip: 0,
      take: MAX_CATALOG_RESULTS,
    },
    search_options: {
      facets: EYEWEAR_FACET_FIELDS as unknown as string[],
      count: "exact",
    },
  }

  return sdk.client.fetch<SearchResponse<{ id: string }>>("/store/search", {
    method: "POST",
    body,
    cache: "no-store",
  })
}
