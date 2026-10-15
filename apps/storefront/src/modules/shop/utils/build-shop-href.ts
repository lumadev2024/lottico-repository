export type ShopSearchParams = Record<string, string | string[] | undefined>

const toArray = (value: string | string[] | undefined): string[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value]

/**
 * Builds a `/shop` query string from the current searchParams with a single
 * facet value toggled on/off. Changing a filter always resets `page`, since
 * the result set it was paginating no longer applies.
 */
export const toggleFacetValueHref = (
  current: ShopSearchParams,
  field: string,
  value: string
): string => {
  const params = new URLSearchParams()

  for (const [key, val] of Object.entries(current)) {
    if (key === field || key === "page") continue
    for (const v of toArray(val)) {
      params.append(key, v)
    }
  }

  const existing = toArray(current[field])
  const next = existing.includes(value)
    ? existing.filter((v) => v !== value)
    : [...existing, value]

  for (const v of next) {
    params.append(field, v)
  }

  const qs = params.toString()
  return qs ? `/shop?${qs}` : "/shop"
}

/** Removes a single applied filter value (for the active-filters chip row). */
export const removeFacetValueHref = (
  current: ShopSearchParams,
  field: string,
  value: string
): string => toggleFacetValueHref(current, field, value)

/** Clears every eyewear filter, keeping sort. */
export const clearAllFiltersHref = (
  current: ShopSearchParams,
  filterFields: readonly string[]
): string => {
  const params = new URLSearchParams()

  for (const [key, val] of Object.entries(current)) {
    if (filterFields.includes(key) || key === "page") continue
    for (const v of toArray(val)) {
      params.append(key, v)
    }
  }

  const qs = params.toString()
  return qs ? `/shop?${qs}` : "/shop"
}
