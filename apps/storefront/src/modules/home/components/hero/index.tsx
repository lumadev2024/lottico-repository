import Image from "next/image"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Text } from "@modules/common/components/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"
import { PRODUCT_IMAGE_FALLBACK_URL } from "@lib/constants/stock-images"
import type { StoreEyewearDetails } from "@lib/data/eyewear"

type HeroProps = {
  product?: HttpTypes.StoreProduct | null
  eyewear?: StoreEyewearDetails | null
}

const Hero = ({ product, eyewear }: HeroProps) => {
  const realImageUrl = product?.thumbnail || product?.images?.[0]?.url
  const imageUrl = product ? realImageUrl || PRODUCT_IMAGE_FALLBACK_URL : null

  return (
    <div className="grid grid-cols-1 items-center gap-10 py-10 small:grid-cols-2 small:gap-16 small:py-20">
      <div className="flex flex-col items-start gap-y-6">
        <span className="rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-muted">
          Boutique eyewear · Secondigliano, Napoli
        </span>

        <h1 className="text-4xl font-semibold leading-[1.1] tracking-tight text-foreground small:text-6xl">
          Vedere bene
          <br />
          cambia tutto.
        </h1>

        <Text className="max-w-md text-base leading-relaxed text-muted small:text-lg">
          Una selezione di occhiali da vista e da sole scelta con cura, e una
          consulenza dedicata in negozio per trovare l&apos;occhiale che ti
          somiglia davvero.
        </Text>

        <div className="flex flex-wrap items-center gap-4">
          <LocalizedClientLink href="/shop">
            <Button variant="coffee" size="large">
              Scopri la collezione
            </Button>
          </LocalizedClientLink>
          <a href="#visita">
            <Button variant="coffee-outline" size="large">
              Prenota una visita
            </Button>
          </a>
        </div>
      </div>

      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card bg-cream small:aspect-square">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={eyewear?.model_name ? `${eyewear.brand ?? ""} ${eyewear.model_name}`.trim() : product!.title}
            fill
            priority
            sizes="(max-width: 768px) 90vw, 45vw"
            className="object-cover object-center"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-muted">
            <PlaceholderImage size={40} />
          </div>
        )}
        {product && !realImageUrl && (
          <span className="absolute bottom-4 right-4 rounded-full bg-surface/90 px-2.5 py-1 text-[10px] text-muted shadow-sm backdrop-blur-sm">
            Immagine rappresentativa
          </span>
        )}

        {product && eyewear?.brand && (
          <div className="absolute bottom-4 left-4 rounded-card bg-surface/90 px-4 py-3 backdrop-blur-sm">
            <Text className="text-xs uppercase tracking-wide text-muted">
              {eyewear.brand}
            </Text>
            <Text className="text-sm font-medium text-foreground">
              {eyewear.model_name || product.title}
            </Text>
          </div>
        )}
      </div>
    </div>
  )
}

export default Hero
