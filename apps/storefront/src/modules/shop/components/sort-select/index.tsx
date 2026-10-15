"use client"

import type { ProductSort } from "@lib/data/search"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { SORT_LABELS } from "@modules/shop/constants"

export default function SortSelect({ sort }: { sort: ProductSort }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handleChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value === "relevance") {
      params.delete("sort")
    } else {
      params.set("sort", value)
    }
    params.delete("page")
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <label className="flex items-center gap-x-2 text-sm">
      <span className="text-muted">Ordina per</span>
      <select
        value={sort}
        onChange={(event) => handleChange(event.target.value)}
        aria-label="Ordina risultati"
        className="rounded-card border border-border bg-background px-3 py-1.5 text-sm text-foreground focus:border-coffee focus:outline-none"
      >
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </label>
  )
}
