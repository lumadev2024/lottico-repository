import type { StoreEyewearDetails } from "@lib/data/eyewear"
import { Text } from "@modules/common/components/ui"

type SpecRow = { label: string; value: string }

const GENDER_LABELS: Record<string, string> = {
  uomo: "Uomo",
  donna: "Donna",
  unisex: "Unisex",
  bambino: "Bambino",
}

const LENS_TYPE_LABELS: Record<string, string> = {
  vista: "Da vista",
  sole: "Da sole",
  neutra: "Neutra",
  fotocromatica: "Fotocromatica",
  polarizzata: "Polarizzata",
  altro: "Altro",
}

/**
 * Renders only the EyewearDetails fields that are actually present —
 * never a literal null/undefined/"-" placeholder for a missing one.
 */
export default function EyewearSpecs({
  eyewear,
}: {
  eyewear: StoreEyewearDetails | null
}) {
  if (!eyewear) {
    return null
  }

  const rows: SpecRow[] = []

  if (eyewear.brand) rows.push({ label: "Brand", value: eyewear.brand })
  if (eyewear.model_name) rows.push({ label: "Modello", value: eyewear.model_name })
  if (eyewear.gender) {
    rows.push({ label: "Genere", value: GENDER_LABELS[eyewear.gender] ?? eyewear.gender })
  }
  if (eyewear.frame_shape) rows.push({ label: "Forma", value: eyewear.frame_shape })
  if (eyewear.frame_material) rows.push({ label: "Materiale", value: eyewear.frame_material })
  if (eyewear.lens_type) {
    rows.push({
      label: "Tipo lente",
      value: LENS_TYPE_LABELS[eyewear.lens_type] ?? eyewear.lens_type,
    })
  }
  rows.push({ label: "Polarizzato", value: eyewear.polarized ? "Sì" : "No" })
  if (eyewear.lens_width) rows.push({ label: "Calibro", value: `${eyewear.lens_width} mm` })
  if (eyewear.bridge_width) rows.push({ label: "Ponte", value: `${eyewear.bridge_width} mm` })
  if (eyewear.temple_length) rows.push({ label: "Asta", value: `${eyewear.temple_length} mm` })

  if (rows.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-y-3" data-testid="eyewear-specs">
      <Text className="text-sm font-medium uppercase tracking-wide text-foreground">
        Dettagli
      </Text>
      <dl className="flex flex-col gap-y-2">
        {rows.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-border pb-2 text-sm"
          >
            <dt className="text-muted">{row.label}</dt>
            <dd className="text-foreground">{row.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
