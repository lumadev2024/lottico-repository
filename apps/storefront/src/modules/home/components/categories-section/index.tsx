import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Text } from "@modules/common/components/ui"

type Tile = {
  key: string
  label: string
  href: string
  tone: "cream" | "sand" | "sage" | "coffee"
  span?: "wide"
}

const TONE_CLASSES: Record<Tile["tone"], string> = {
  cream: "bg-cream text-foreground",
  sand: "bg-sand text-foreground",
  sage: "bg-sage/40 text-foreground",
  coffee: "bg-coffee text-white",
}

/**
 * A category tile links to a real product category, a collection tile to a
 * real collection — both read from the Store API, nothing hardcoded beyond
 * the visual tone assigned to each slot.
 */
export default async function CategoriesSection() {
  const [categories, { collections }] = await Promise.all([
    listCategories(),
    listCollections({ fields: "id,handle,title" }),
  ])

  const vista = categories?.find((c) => c.handle === "da vista")
  const sole = categories?.find((c) => c.handle === "da sole")
  const novita = collections?.find((c) => c.handle === "nuovi arrivi")
  const bestSeller = collections?.find((c) => c.handle === "best seller")

  const tiles: Tile[] = [
    vista && {
      key: "vista",
      label: vista.name,
      href: `/categories/${vista.handle}`,
      tone: "cream",
      span: "wide",
    },
    sole && {
      key: "sole",
      label: sole.name,
      href: `/categories/${sole.handle}`,
      tone: "coffee",
    },
    novita && {
      key: "novita",
      label: novita.title,
      href: `/collections/${novita.handle}`,
      tone: "sand",
    },
    bestSeller && {
      key: "best-seller",
      label: bestSeller.title,
      href: `/collections/${bestSeller.handle}`,
      tone: "sage",
      span: "wide",
    },
  ].filter((tile): tile is Tile => Boolean(tile))

  if (!tiles.length) {
    return null
  }

  return (
    <div className="grid grid-cols-2 gap-4 small:grid-cols-3 small:gap-6">
      {tiles.map((tile) => (
        <LocalizedClientLink
          key={tile.key}
          href={tile.href}
          className={`group relative flex h-40 flex-col justify-end overflow-hidden rounded-card p-6 transition-transform duration-300 hover:-translate-y-1 small:h-56 ${
            TONE_CLASSES[tile.tone]
          } ${tile.span === "wide" ? "col-span-2 small:col-span-2" : ""}`}
        >
          <Text className="text-xl font-medium small:text-2xl">
            {tile.label}
          </Text>
          <span className="mt-1 text-sm opacity-80 transition-transform group-hover:translate-x-1">
            Scopri →
          </span>
        </LocalizedClientLink>
      ))}
    </div>
  )
}
