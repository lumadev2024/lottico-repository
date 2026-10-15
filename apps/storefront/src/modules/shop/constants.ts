import type { EyewearFacetField } from "@lib/data/search"

export const FACET_LABELS: Record<EyewearFacetField, string> = {
  brand: "Brand",
  gender: "Genere",
  frame_shape: "Forma",
  frame_material: "Materiale",
  frame_color: "Colore montatura",
  lens_type: "Tipo lente",
  polarized: "Polarizzato",
}

export const FACET_ORDER: EyewearFacetField[] = [
  "brand",
  "gender",
  "frame_shape",
  "frame_material",
  "frame_color",
  "lens_type",
  "polarized",
]

export const SORT_LABELS = {
  relevance: "Consigliati",
  price_asc: "Prezzo crescente",
  price_desc: "Prezzo decrescente",
} as const

/**
 * Facet values arrive as whatever was indexed. Booleans are indexed as the
 * strings "true"/"false" — this gives them an Italian label without
 * reformatting any other (free-text) facet value.
 */
export const formatFacetValue = (
  field: EyewearFacetField,
  value: string
): string => {
  if (field === "polarized") {
    return value === "true" ? "Sì" : "No"
  }
  return value
}
