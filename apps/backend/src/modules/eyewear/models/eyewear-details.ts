import { model } from "@medusajs/framework/utils"

export const EYEWEAR_GENDER_VALUES = [
  "uomo",
  "donna",
  "unisex",
  "bambino",
] as const

export const EYEWEAR_LENS_TYPE_VALUES = [
  "vista",
  "sole",
  "neutra",
  "fotocromatica",
  "polarizzata",
  "altro",
] as const

const EyewearDetails = model.define("eyewear_details", {
  id: model.id().primaryKey(),
  brand: model.text(),
  model_name: model.text().nullable(),
  gender: model.enum([...EYEWEAR_GENDER_VALUES]).nullable(),
  frame_shape: model.text().nullable(),
  frame_material: model.text().nullable(),
  frame_color: model.text().nullable(),
  lens_color: model.text().nullable(),
  lens_type: model.enum([...EYEWEAR_LENS_TYPE_VALUES]).nullable(),
  polarized: model.boolean().default(false),
  lens_width: model.number().nullable(),
  bridge_width: model.number().nullable(),
  temple_length: model.number().nullable(),
})

export default EyewearDetails
