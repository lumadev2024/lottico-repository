import { Button, Text } from "@modules/common/components/ui"

export default function VisitSection() {
  return (
    <div
      id="visita"
      className="scroll-mt-24 rounded-card bg-coffee px-6 py-16 text-white small:px-16 small:py-24"
    >
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-y-6 text-center">
        <span className="text-xs uppercase tracking-[0.2em] text-white/70">
          Consulenza in negozio
        </span>
        <h2 className="text-3xl font-medium small:text-4xl">
          Prenditi cura della tua vista.
        </h2>
        <Text className="text-base text-white/80 small:text-lg">
          In negozio a Secondigliano effettuiamo controlli della vista e
          consulenza personalizzata per aiutarti a scegliere l&apos;occhiale
          più adatto a te, tra vista e stile.
        </Text>
        {/* Booking form not implemented yet: links to the store section's
            contact placeholder rather than a fabricated phone/route. */}
        <a href="#contatti">
          <Button variant="secondary" size="large" className="mt-2">
            Prenota una visita
          </Button>
        </a>
      </div>
    </div>
  )
}
