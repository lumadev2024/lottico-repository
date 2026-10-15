import { MapPin } from "@medusajs/icons"
import { Text } from "@modules/common/components/ui"
import PlaceholderImage from "@modules/common/icons/placeholder-image"

export default function StoreSection() {
  return (
    <div
      id="contatti"
      className="scroll-mt-24 grid grid-cols-1 items-center gap-10 small:grid-cols-2 small:gap-16"
    >
      <div className="order-2 flex aspect-[4/3] items-center justify-center rounded-card bg-cream text-muted small:order-1">
        {/* Real storefront photo not available yet: explicit placeholder,
            not a stock image, per the no-fabricated-content requirement. */}
        <div className="flex flex-col items-center gap-y-2">
          <PlaceholderImage size={40} />
          <Text className="text-xs">Foto del negozio in arrivo</Text>
        </div>
      </div>

      <div className="order-1 flex flex-col gap-y-5 small:order-2">
        <span className="text-xs uppercase tracking-[0.2em] text-coffee font-medium">
          Il negozio
        </span>
        <h2 className="text-3xl font-medium text-foreground small:text-4xl">
          L&apos;Ottico
          <br />
          Secondigliano, Napoli
        </h2>
        <Text className="text-muted text-base leading-relaxed">
          Boutique eyewear con consulenza personalizzata e controlli della
          vista in sede. Vieni a scoprire la nostra selezione e a parlare con
          noi del tuo occhiale ideale.
        </Text>

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
