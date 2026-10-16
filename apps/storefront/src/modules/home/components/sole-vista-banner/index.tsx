import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Text } from "@modules/common/components/ui"

type Tile = {
  key: string
  title: string
  description: string
  href: string
  image: string
  alt: string
}

/**
 * Two editorial banners linking to the two real top-level categories
 * ("da sole" / "da vista"). Tiles are omitted if the category doesn't
 * exist in the catalog, same guard as `categories-section`.
 */
export default async function SoleVistaBanner() {
  const categories = await listCategories()

  const sole = categories?.find((c) => c.handle === "da sole")
  const vista = categories?.find((c) => c.handle === "da vista")

  const tiles: Tile[] = [
    sole && {
      key: "sole",
      title: "Occhiali\nda sole",
      description: "Protezione, stile e personalizzazione per ogni momento.",
      href: `/categories/${sole.handle}`,
      image: "/images/store/interior-wide.jpg",
      alt: "Espositore di occhiali da sole in negozio",
    },
    vista && {
      key: "vista",
      title: "Occhiali\nda vista",
      description:
        "Comfort visivo e design ricercato per il tuo everyday look.",
      href: `/categories/${vista.handle}`,
      image: "/images/store/interior-shelves.jpg",
      alt: "Espositore di occhiali da vista in negozio",
    },
  ].filter((tile): tile is Tile => Boolean(tile))

  if (!tiles.length) {
    return null
  }

  return (
    <div className="grid grid-cols-1 gap-4 small:grid-cols-2 small:gap-6">
      {tiles.map((tile) => (
        <div
          key={tile.key}
          className="relative flex h-72 flex-col justify-end overflow-hidden rounded-card small:h-80"
        >
          <Image
            src={tile.image}
            alt={tile.alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="relative flex flex-col items-start gap-y-3 p-8 text-white">
            <h3 className="whitespace-pre-line text-3xl font-semibold leading-tight">
              {tile.title}
            </h3>
            <Text className="max-w-xs text-sm text-white/80">
              {tile.description}
            </Text>
            <LocalizedClientLink href={tile.href}>
              <Button
                variant="secondary"
                size="medium"
                className="mt-1 border-0"
              >
                Scopri ora
              </Button>
            </LocalizedClientLink>
          </div>
        </div>
      ))}
    </div>
  )
}
