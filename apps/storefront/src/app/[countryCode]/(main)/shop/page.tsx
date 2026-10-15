import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { retrieveProductEyewearDetails } from "@lib/data/eyewear"
import {
  EYEWEAR_FACET_FIELDS,
  searchProducts,
  type ProductSearchFilters,
  type ProductSort,
} from "@lib/data/search"
import { sortProducts } from "@lib/util/sort-products"
import ShopTemplate from "@modules/shop/templates"

export const metadata: Metadata = {
  title: "Catalogo | L'Ottico",
  description:
    "Sfoglia la nostra selezione di occhiali da vista e da sole: filtra per brand, genere, forma, materiale e altro.",
}

const PAGE_SIZE = 12

const SORT_VALUES: ProductSort[] = ["relevance", "price_asc", "price_desc"]

const parseSort = (value?: string): ProductSort =>
  SORT_VALUES.includes(value as ProductSort) ? (value as ProductSort) : "relevance"

const parseFilters = (
  searchParams: Record<string, string | string[] | undefined>
): ProductSearchFilters => {
  const filters: ProductSearchFilters = {}

  for (const field of EYEWEAR_FACET_FIELDS) {
    const raw = searchParams[field]
    if (raw === undefined) continue

    if (field === "polarized") {
      const value = Array.isArray(raw) ? raw[0] : raw
      if (value === "true" || value === "false") {
        filters.polarized = value === "true"
      }
      continue
    }

    filters[field] = Array.isArray(raw) ? raw : [raw]
  }

  return filters
}

const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+thumbnail,*images,+collection.title,+created_at"

export default async function ShopPage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { countryCode } = await props.params
  const searchParams = await props.searchParams

  const filters = parseFilters(searchParams)
  const sort = parseSort(
    Array.isArray(searchParams.sort) ? searchParams.sort[0] : searchParams.sort
  )
  const page = Math.max(
    1,
    Number(Array.isArray(searchParams.page) ? searchParams.page[0] : searchParams.page) || 1
  )

  const searchResult = await searchProducts({ filters })
  const matchedIds = searchResult.results[0]?.hits.map((hit) => hit.id) ?? []
  const facets = searchResult.results[0]?.facets ?? {}
  const totalMatches = searchResult.results[0]?.metadata.count ?? matchedIds.length

  if (matchedIds.length === 0) {
    return (
      <ShopTemplate
        countryCode={countryCode}
        products={[]}
        eyewearByProductId={new Map()}
        facets={facets}
        activeFilters={searchParams}
        sort={sort}
        page={1}
        pageCount={0}
        totalMatches={0}
      />
    )
  }

  const {
    response: { products: matchedProducts },
  } = await listProducts({
    countryCode,
    queryParams: {
      id: matchedIds,
      limit: matchedIds.length,
      fields: PRODUCT_FIELDS,
    },
  })

  // listProducts doesn't guarantee the search's relevance order, so re-apply
  // it before any explicit sort/pagination.
  const byId = new Map(matchedProducts.map((product) => [product.id, product]))
  const relevanceOrdered = matchedIds
    .map((id) => byId.get(id))
    .filter((product): product is NonNullable<typeof product> => Boolean(product))

  const sorted =
    sort === "relevance"
      ? relevanceOrdered
      : sortProducts(relevanceOrdered, sort)

  const pageCount = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const pageProducts = sorted.slice(start, start + PAGE_SIZE)

  const eyewearByProductId = new Map(
    await Promise.all(
      pageProducts.map(
        async (product) =>
          [product.id, await retrieveProductEyewearDetails(product.id)] as const
      )
    )
  )

  return (
    <ShopTemplate
      countryCode={countryCode}
      products={pageProducts}
      eyewearByProductId={eyewearByProductId}
      facets={facets}
      activeFilters={searchParams}
      sort={sort}
      page={currentPage}
      pageCount={pageCount}
      totalMatches={totalMatches}
    />
  )
}
