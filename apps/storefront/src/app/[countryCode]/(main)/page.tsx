import { Metadata } from "next"

import BrandStrip from "@modules/home/components/brand-strip"
import CategoriesSection from "@modules/home/components/categories-section"
import DemoProductGrid from "@modules/home/components/demo-product-grid"
import Hero from "@modules/home/components/hero"
import ProductGrid from "@modules/home/components/product-grid"
import SectionHeading from "@modules/home/components/section-heading"
import SoleVistaBanner from "@modules/home/components/sole-vista-banner"
import StoreGallery from "@modules/home/components/store-gallery"
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

  return (
    <div className="content-container flex flex-col gap-y-24 py-10 small:gap-y-32 small:py-16">
      <Hero />

      <section>
        <SectionHeading
          eyebrow="Selezione"
          title="Nuovi arrivi"
          description="Scopri le ultime collezioni di occhiali da vista e da sole, selezionate per te."
          action={
            <LocalizedClientLink
              href="/shop"
              className="text-sm font-medium text-coffee hover:underline"
            >
              Vedi tutti →
            </LocalizedClientLink>
          }
        />
        <DemoProductGrid />
      </section>

      <SoleVistaBanner />

      <section id="brand" className="scroll-mt-24">
        <SectionHeading
          eyebrow="Brand"
          title="Brand selezionati"
          description="I migliori marchi di occhiali da vista e da sole, per ogni stile."
        />
        <BrandStrip />
      </section>

      <StoreSection />

      <section>
        <SectionHeading eyebrow="Esplora" title="Categorie" />
        <CategoriesSection />
      </section>

      <section>
        <SectionHeading
          eyebrow="L'esperienza L'Ottico"
          title="Un mondo di stile, nel nostro negozio"
          description="Scopri il nostro spazio, i dettagli, le collezioni e l'atmosfera di L'Ottico."
        />
        <StoreGallery />
      </section>

      <section>
        <SectionHeading eyebrow="Dal catalogo" title="Disponibile ora" />
        <ProductGrid countryCode={countryCode} limit={4} />
      </section>

      <VisitSection />
    </div>
  )
}
