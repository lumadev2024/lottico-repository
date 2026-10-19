import Image from "next/image"
import { MapPin } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"

const FEATURES = [
  "Consulenza stilistica personalizzata",
  "Controllo della vista",
  "Esperienza e passione al tuo servizio",
]

export default function StoreSection() {
  return (
    <div
      id="contatti"
      className="scroll-mt-24 grid grid-cols-1 items-center gap-10 small:grid-cols-2 small:gap-16"
    >
      <div className="relative order-2 aspect-[4/3] overflow-hidden rounded-card small:order-1">
        <Image
          src="/images/store/interior-counter.jpg"
          alt="Bancone e vetrina interna del negozio L'Ottico"
          fill
          sizes="(max-width: 1024px) 90vw, 45vw"
          className="object-cover object-center"
        />
      </div>

      <div className="order-1 flex flex-col gap-y-5 small:order-2">
        <span className="text-xs uppercase tracking-[0.2em] text-coffee font-medium">
          Il negozio
        </span>
        <h2 className="font-display text-3xl font-medium italic text-foreground small:text-4xl">
          Vieni a trovarci
          <br />
          da L&apos;Ottico
        </h2>
        <Text className="text-muted text-base leading-relaxed">
          Un punto di riferimento a Secondigliano per chi cerca qualità,
          consulenza professionale e uno stile unico. Nel nostro negozio ti
          guidiamo nella scelta dell&apos;occhiale perfetto, con un servizio
          su misura.
        </Text>

        <ul className="flex flex-col gap-y-3">
          {FEATURES.map((feature) => (
            <li key={feature} className="flex items-start gap-x-3 text-foreground">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sage" />
              <Text>{feature}</Text>
            </li>
          ))}
        </ul>

        <div className="flex items-start gap-x-3 text-foreground">
          <MapPin className="mt-0.5 shrink-0" />
          <div>
            {/* Placeholder: no real address/hours in the data layer yet. */}
            <Text className="font-medium">Indirizzo da confermare</Text>
            <Text className="text-sm text-muted">
              Orari di apertura in arrivo
            </Text>
          </div>
        </div>
      </div>
    </div>
  )
}
