import Image from "next/image"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Text } from "@modules/common/components/ui"

const FEATURES = [
  { label: "Consulenza personalizzata" },
  { label: "Lenti di qualità certificate" },
  { label: "I migliori brand dal mondo" },
]

const COLLAGE = [
  {
    src: "/images/store/storefront-sign.jpg",
    alt: "Insegna L'Ottico all'ingresso del negozio",
    label: "La nostra storia",
    href: "/#contatti",
  },
  {
    src: "/images/store/interior-shelves.jpg",
    alt: "Espositori di occhiali da vista e da sole in negozio",
    label: "I nostri brand",
    href: "/#brand",
  },
  {
    src: "/images/store/interior-wide.jpg",
    alt: "Interno del negozio L'Ottico con illuminazione a led",
    label: "Vivi l'esperienza in negozio",
    href: "/#contatti",
  },
]

const Hero = () => {
  return (
    <div className="grid grid-cols-1 items-center gap-10 py-10 small:grid-cols-2 small:gap-16 small:py-16">
      <div className="flex flex-col items-start gap-y-6">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-muted">
          Occhiali · Stile · Benessere visivo
        </span>

        <h1 className="text-4xl font-semibold leading-[1.08] tracking-tight text-foreground small:text-6xl">
          Vedi il mondo
          <br />
          con il tuo stile.
        </h1>

        <Text className="max-w-md text-base leading-relaxed text-muted small:text-lg">
          Da L&apos;Ottico uniamo esperienza, stile e tecnologia per offrirti
          il meglio della visione, ogni giorno.
        </Text>

        <LocalizedClientLink href="/shop">
          <Button variant="coffee" size="large">
            Scopri la collezione
          </Button>
        </LocalizedClientLink>

        <div className="mt-4 flex flex-wrap gap-x-8 gap-y-3">
          {FEATURES.map((feature) => (
            <div key={feature.label} className="flex items-center gap-x-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
              <Text className="text-sm text-foreground/80">
                {feature.label}
              </Text>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 small:gap-4">
        <a
          href={COLLAGE[0].href}
          className="group relative col-span-2 aspect-[16/10] overflow-hidden rounded-card small:aspect-[16/9]"
        >
          <Image
            src={COLLAGE[0].src}
            alt={COLLAGE[0].alt}
            fill
            priority
            sizes="(max-width: 1024px) 90vw, 45vw"
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <span className="absolute bottom-3 left-3 inline-flex items-center gap-x-2 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
            {COLLAGE[0].label} →
          </span>
        </a>
        {COLLAGE.slice(1).map((item) => (
          <a
            key={item.label}
            href={item.href}
            className="group relative aspect-square overflow-hidden rounded-card"
          >
            <Image
              src={item.src}
              alt={item.alt}
              fill
              sizes="(max-width: 1024px) 45vw, 22vw"
              className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute bottom-3 left-3 right-3 inline-flex items-center gap-x-1.5 rounded-full bg-surface/90 px-3 py-1.5 text-xs font-medium text-foreground shadow-sm backdrop-blur-sm">
              {item.label} →
            </span>
          </a>
        ))}
      </div>
    </div>
  )
}

export default Hero
