import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import { getProductPrice } from "@lib/util/get-product-price"
import { PRODUCT_IMAGE_FALLBACK_URL } from "@lib/constants/stock-images"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"
import type { StoreEyewearDetails } from "@lib/data/eyewear"

type ProductCardProps = {
  product: HttpTypes.StoreProduct
  eyewear?: StoreEyewearDetails | null
  badge?: string
  unavailable?: boolean
}

/**
 * Premium product card for the eyewear catalog. Tolerates every piece of data
 * being absent (image, EyewearDetails, price) rather than crashing, since the
 * real catalog today holds a single product and that won't always be true.
 */
export default function ProductCard({
  product,
  eyewear,
  badge,
  unavailable,
}: ProductCardProps) {
  const { cheapestPrice } = getProductPrice({ product })
  const realImageUrl = product.thumbnail || product.images?.[0]?.url
  const imageUrl = realImageUrl || PRODUCT_IMAGE_FALLBACK_URL

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group flex flex-col"
    >
      <div className="relative overflow-hidden rounded-card bg-cream aspect-[4/5]">
        <Image
          src={imageUrl}
          alt={eyewear?.model_name || product.title}
          fill
          sizes="(max-width: 768px) 50vw, 25vw"
          className={clx(
            "object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]",
            unavailable && "grayscale"
          )}
        />
        {!realImageUrl && (
          <span className="absolute bottom-3 right-3 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] text-muted shadow-sm">
            Immagine rappresentativa
          </span>
        )}
        {unavailable ? (
          <span className="absolute left-3 top-3 rounded-full bg-muted px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white shadow-sm">
            Non disponibile
          </span>
        ) : (
          badge && (
            <span className="absolute left-3 top-3 rounded-full bg-coffee px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white shadow-sm">
              {badge}
            </span>
          )
        )}
      </div>

      <div className="mt-4 flex flex-col gap-y-1">
        <div className="flex items-start justify-between gap-x-3">
          <div>
            {eyewear?.brand && (
              <Text className="text-xs uppercase tracking-wide text-muted">
                {eyewear.brand}
              </Text>
            )}
            <Text className="text-base font-medium text-foreground">
              {eyewear?.model_name || product.title}
            </Text>
          </div>

          {cheapestPrice && (
            <Text
              className={clx(
                "shrink-0 text-base font-medium text-foreground",
                cheapestPrice.price_type === "sale" && "text-coffee"
              )}
            >
              {cheapestPrice.calculated_price}
            </Text>
          )}
        </div>

        {eyewear?.frame_color && (
          <div className="mt-1 flex items-center gap-x-2">
            <span
              className="h-3 w-3 rounded-full border border-border"
              style={{ backgroundColor: frameColorSwatch(eyewear.frame_color) }}
              aria-hidden
            />
            <Text className="text-xs text-muted">{eyewear.frame_color}</Text>
          </div>
        )}
      </div>
    </LocalizedClientLink>
  )
}

/**
 * EyewearDetails stores `frame_color` as free text (e.g. "Nero", "Tortoise"),
 * not a color value, so this is a best-effort cosmetic swatch for the common
 * Italian color names rather than a data-accurate rendering.
 */
function frameColorSwatch(frameColor: string): string {
  const known: Record<string, string> = {
    nero: "#1c1a18",
    marrone: "#6f4e37",
    tartarugato: "#8a6a3f",
    oro: "#c9a66b",
    argento: "#c7c7c7",
    blu: "#2c3e68",
    verde: "#3f5945",
    rosso: "#7a2e2e",
    trasparente: "#e9e4da",
  }

  return known[frameColor.trim().toLowerCase()] ?? "#c9c2b5"
}
