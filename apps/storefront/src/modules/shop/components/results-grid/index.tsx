import { HttpTypes } from "@medusajs/types"
import ProductCard from "@modules/products/components/product-card"
import type { StoreEyewearDetails } from "@lib/data/eyewear"

const isProductAvailable = (product: HttpTypes.StoreProduct): boolean => {
  if (!product.variants || product.variants.length === 0) {
    return false
  }

  return product.variants.some((variant) => {
    if (!variant.manage_inventory) return true
    if (variant.allow_backorder) return true
    return (variant.inventory_quantity || 0) > 0
  })
}

export default function ResultsGrid({
  products,
  eyewearByProductId,
}: {
  products: HttpTypes.StoreProduct[]
  eyewearByProductId: Map<string, StoreEyewearDetails | null>
}) {
  return (
    <div
      className="grid grid-cols-2 gap-x-5 gap-y-10 small:grid-cols-3"
      data-testid="shop-product-grid"
    >
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          eyewear={eyewearByProductId.get(product.id)}
          unavailable={!isProductAvailable(product)}
          badge={
            (product as unknown as { collection?: { title?: string } })
              .collection?.title
          }
        />
      ))}
    </div>
  )
}
