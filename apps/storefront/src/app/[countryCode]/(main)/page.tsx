import { Metadata } from "next"

import { listProducts } from "@lib/data/products"
import { retrieveProductEyewearDetails } from "@lib/data/eyewear"
import BrandStrip from "@modules/home/components/brand-strip"
import CategoriesSection from "@modules/home/components/categories-section"
import Hero from "@modules/home/components/hero"
import ProductGrid from "@modules/home/components/product-grid"
import SectionHeading from "@modules/home/components/section-heading"
import StoreSection from "@modules/home/components/store-section"
import VisitSection from "@modules/home/components/visit-section"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "L'Ottico | Occhiali da vista e da sole a Napoli",
  description:
    "Selezione eyewear premium, consulenza e visite in sede a Secondigliano, Napoli.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const { countryCode } = await props.params

  const {
    response: { products: heroProducts },
  } = await listProducts({
    countryCode,
    queryParams: { limit: 1 },
  })

  const heroProduct = heroProducts[0] ?? null
  const heroEyewear = heroProduct
    ? await retrieveProductEyewearDetails(heroProduct.id)
    : null

  return (
    <div className="content-container flex flex-col gap-y-24 py-10 small:gap-y-32 small:py-16">
      <Hero product={heroProduct} eyewear={heroEyewear} />

      <section>
        <SectionHeading
          eyebrow="Selezione"
          title="Novità in collezione"
          description="I modelli più recenti della nostra selezione, scelti per qualità dei materiali e carattere."
          action={
            <LocalizedClientLink
              href="/shop"
              className="text-sm font-medium text-coffee hover:underline"
            >
              Vedi tutto il catalogo →
            </LocalizedClientLink>
          }
        />
        <ProductGrid countryCode={countryCode} />
      </section>

      <section>
        <SectionHeading eyebrow="Esplora" title="Categorie" />
        <CategoriesSection />
      </section>

      <section id="brand" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Brand"
          title="I brand che ami"
          align="center"
        />
        <BrandStrip />
      </section>

      <VisitSection />

      <StoreSection />
    </div>
  )
}
