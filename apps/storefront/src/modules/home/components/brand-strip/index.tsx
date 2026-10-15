import { Text } from "@modules/common/components/ui"

/**
 * DEMO DATA — not sourced from the catalog. The real catalog today only has
 * one brand (Ray-Ban, via EyewearDetails on the single real product). This
 * strip exists to show the intended layout for a brand wall; it must not be
 * read as a claim that these brands are in stock. Replace with a real
 * brand/EyewearDetails-driven list once the catalog has enough brands to
 * query distinctly.
 */
const DEMO_BRANDS = ["Ray-Ban", "Persol", "Prada", "Gucci", "Tom Ford"]

export default function BrandStrip() {
  return (
    <div>
      <div className="mb-6 grid grid-cols-2 gap-3 small:grid-cols-5 small:gap-4">
        {DEMO_BRANDS.map((brand) => (
          <div
            key={brand}
            className="flex h-20 items-center justify-center rounded-card border border-border bg-surface px-4 small:h-24"
          >
            <Text className="text-lg font-medium italic text-foreground small:text-xl">
              {brand}
            </Text>
          </div>
        ))}
      </div>
      <Text className="text-center text-xs text-muted">
        Selezione dimostrativa dei brand che l&apos;Ottico propone in negozio —
        disponibilità da confermare in sede.
      </Text>
    </div>
  )
}
