import { z } from "@medusajs/framework/zod"
import {
  EYEWEAR_GENDER_VALUES,
  EYEWEAR_LENS_TYPE_VALUES,
} from "../../../../../modules/eyewear/models/eyewear-details"

export const AdminUpsertEyewearDetailsSchema = z.object({
  brand: z.string().min(1),
  model_name: z.string().min(1).nullish(),
  gender: z.enum(EYEWEAR_GENDER_VALUES).nullish(),
  frame_shape: z.string().min(1).nullish(),
  frame_material: z.string().min(1).nullish(),
  frame_color: z.string().min(1).nullish(),
  lens_color: z.string().min(1).nullish(),
  lens_type: z.enum(EYEWEAR_LENS_TYPE_VALUES).nullish(),
  polarized: z.boolean().optional(),
  lens_width: z.number().int().min(0).nullish(),
  bridge_width: z.number().int().min(0).nullish(),
  temple_length: z.number().int().min(0).nullish(),
})

export type AdminUpsertEyewearDetailsInput = z.infer<
  typeof AdminUpsertEyewearDetailsSchema
>
