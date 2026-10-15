import { listProducts } from "@lib/data/products"
import { retrieveProductEyewearDetails } from "@lib/data/eyewear"
import ProductCard from "@modules/products/components/product-card"

const FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,*variants.images,+thumbnail,*images,+collection.title"

/**
 * Fetches real products for the given country/region and their EyewearDetails
 * in parallel, then renders a responsive card grid. The real catalog holds a
 * single product today: the grid is built to look intentional with one item
 * as much as with a dozen, rather than assuming a full shelf.
 */
export default async function ProductGrid({
  countryCode,
  limit = 8,
}: {
  countryCode: string
  limit?: number
}) {
  const {
    response: { products },
  } = await listProducts({
    countryCode,
    queryParams: { limit, fields: FIELDS },
  })

  if (!products.length) {
    return (
      <p className="text-muted">
        Nessun prodotto disponibile al momento. Torna a trovarci presto.
      </p>
    )
  }

  const eyewearByProductId = new Map(
    await Promise.all(
      products.map(
        async (product) =>
          [product.id, await retrieveProductEyewearDetails(product.id)] as const
      )
    )
  )

  return (
    <div
      className="grid grid-cols-2 gap-x-5 gap-y-10 small:grid-cols-4"
      data-testid="home-product-grid"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          eyewear={eyewearByProductId.get(product.id)}
          badge={
            (product as unknown as { collection?: { title?: string } })
              .collection?.title
          }
        />
      ))}
    </div>
  )
}
