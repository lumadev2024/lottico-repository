import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text, clx } from "@modules/common/components/ui"

/**
 * DEMO DATA — not sourced from the catalog. The real catalog today holds a
 * single product, so this grid uses free-license stock photography (Pexels)
 * to show the intended "new arrivals" layout at full density. Prices and
 * names are illustrative, not real listings; every card links to the real
 * shop rather than a fabricated product page. Replace with `ProductGrid`
 * (which reads the real Store API) once the catalog has enough products.
 */
type DemoProduct = {
  name: string
  description: string
  price: string
  compareAt?: string
  image: string
  badge?: string
  swatches: string[]
}

const DEMO_PRODUCTS: DemoProduct[] = [
  {
    name: "Ottico Noir",
    description: "Montatura minimal, chiarezza quotidiana.",
    price: "€ 155,00",
    image: "/images/products/veluno-noir.jpg",
    badge: "Best seller",
    swatches: ["#1c1a18", "#6f4e37", "#8a6a3f"],
  },
  {
    name: "Amber Edge",
    description: "Toni caldi, stile senza sforzo.",
    price: "€ 180,00",
    image: "/images/products/amber-edge.jpg",
    swatches: ["#8a6a3f", "#c9a66b"],
  },
  {
    name: "Scarlet Bold",
    description: "Colore audace, sguardo da protagonista.",
    price: "€ 260,00",
    image: "/images/products/scarlet-bold.jpg",
    badge: "Nuovo arrivo",
    swatches: ["#7a2e2e", "#1c1a18"],
  },
  {
    name: "Clear Form",
    description: "Design pulito, finiture moderne.",
    price: "€ 190,00",
    image: "/images/products/clear-form.jpg",
    swatches: ["#e9e4da", "#c7c7c7"],
  },
  {
    name: "Blush Tint",
    description: "Sfumatura delicata, eleganza discreta.",
    price: "€ 175,00",
    compareAt: "€ 210,00",
    image: "/images/products/blush-tint.jpg",
    badge: "Best seller",
    swatches: ["#d9b8ad", "#c9a66b"],
  },
  {
    name: "Midnight Gold",
    description: "Lenti scure, dettagli preziosi.",
    price: "€ 210,00",
    image: "/images/products/midnight-gold.jpg",
    swatches: ["#1c1a18", "#c9a66b"],
  },
]

export default function DemoProductGrid() {
  return (
    <div>
      <div
        className="grid grid-cols-2 gap-x-5 gap-y-10 small:grid-cols-3"
        data-testid="home-demo-product-grid"
      >
        {DEMO_PRODUCTS.map((item) => (
          <LocalizedClientLink
            key={item.name}
            href="/shop"
            className="group flex flex-col"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-card bg-cream">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 50vw, 30vw"
                className="object-cover object-center transition-transform duration-300 group-hover:scale-[1.03]"
              />
              {item.badge && (
                <span className="absolute left-3 top-3 rounded-full bg-coffee px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white shadow-sm">
                  {item.badge}
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-col gap-y-1">
              <div className="flex items-start justify-between gap-x-3">
                <div>
                  <Text className="text-base font-medium text-foreground">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-muted">
                    {item.description}
                  </Text>
                </div>
                <div className="shrink-0 text-right">
                  <Text className="text-base font-medium text-foreground">
                    {item.price}
                  </Text>
                  {item.compareAt && (
                    <Text className="text-xs text-muted line-through">
                      {item.compareAt}
                    </Text>
                  )}
                </div>
              </div>

              <div className="mt-1 flex items-center gap-x-1.5">
                {item.swatches.map((swatch, i) => (
                  <span
                    key={i}
                    className={clx(
                      "h-3 w-3 rounded-full border border-border"
                    )}
                    style={{ backgroundColor: swatch }}
                    aria-hidden
                  />
                ))}
              </div>
            </div>
          </LocalizedClientLink>
        ))}
      </div>
      <Text className="mt-8 text-center text-xs text-muted">
        Anteprima dimostrativa con immagini stock — il catalogo reale è
        disponibile su{" "}
        <LocalizedClientLink href="/shop" className="underline">
          Catalogo
        </LocalizedClientLink>
        .
      </Text>
    </div>
  )
}
