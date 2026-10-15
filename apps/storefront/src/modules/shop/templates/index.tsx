import { HttpTypes } from "@medusajs/types"
import type { StoreEyewearDetails } from "@lib/data/eyewear"
import type { ProductSort, SearchFacetResult } from "@lib/data/search"
import { Pagination } from "@modules/store/components/pagination"
import ActiveFilters from "@modules/shop/components/active-filters"
import EmptyState from "@modules/shop/components/empty-state"
import FiltersDrawer from "@modules/shop/components/filters-drawer"
import FiltersSidebar from "@modules/shop/components/filters-sidebar"
import ResultsGrid from "@modules/shop/components/results-grid"
import SortSelect from "@modules/shop/components/sort-select"
import { FACET_ORDER } from "@modules/shop/constants"
import type { ShopSearchParams } from "@modules/shop/utils/build-shop-href"

type ShopTemplateProps = {
  countryCode: string
  products: HttpTypes.StoreProduct[]
  eyewearByProductId: Map<string, StoreEyewearDetails | null>
  facets: Record<string, SearchFacetResult>
  activeFilters: ShopSearchParams
  sort: ProductSort
  page: number
  pageCount: number
  totalMatches: number
}

export default function ShopTemplate({
  products,
  eyewearByProductId,
  facets,
  activeFilters,
  sort,
  page,
  pageCount,
  totalMatches,
}: ShopTemplateProps) {
  const hasFilters = FACET_ORDER.some((field) => activeFilters[field] !== undefined)

  return (
    <div className="content-container py-10 small:py-16">
      <div className="mb-8 flex flex-col gap-y-4">
        <h1 className="font-serif text-3xl text-foreground small:text-4xl">
          Catalogo
        </h1>
        <div className="flex items-center justify-between gap-x-4">
          <div className="flex items-center gap-x-4">
            <p className="text-sm text-muted">
              {totalMatches} {totalMatches === 1 ? "risultato" : "risultati"}
            </p>
            <FiltersDrawer resultCount={totalMatches}>
              <FiltersSidebar facets={facets} searchParams={activeFilters} />
            </FiltersDrawer>
          </div>
          <SortSelect sort={sort} />
        </div>
        <ActiveFilters searchParams={activeFilters} />
      </div>

      <div className="flex gap-x-10">
        <aside className="hidden w-56 shrink-0 small:block">
          <FiltersSidebar facets={facets} searchParams={activeFilters} />
        </aside>

        <div className="flex-1">
          {products.length === 0 ? (
            <EmptyState hasFilters={hasFilters} />
          ) : (
            <>
              <ResultsGrid
                products={products}
                eyewearByProductId={eyewearByProductId}
              />
              {pageCount > 1 && (
                <Pagination page={page} totalPages={pageCount} data-testid="shop-pagination" />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
