import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"

const StoreProductIdParamsSchema = z.object({
  id: z.string().min(1),
})

type StoreEyewearDetails = {
  brand: string
  model_name: string | null
  gender: string | null
  frame_shape: string | null
  frame_material: string | null
  frame_color: string | null
  lens_color: string | null
  lens_type: string | null
  polarized: boolean
  lens_width: number | null
  bridge_width: number | null
  temple_length: number | null
}

type ProductWithEyewearDetails = {
  id: string
  eyewear_details?: StoreEyewearDetails | null
}

const toStoreEyewearDetails = (
  details: StoreEyewearDetails | null | undefined
): StoreEyewearDetails | null => {
  if (!details) {
    return null
  }

  return {
    brand: details.brand,
    model_name: details.model_name,
    gender: details.gender,
    frame_shape: details.frame_shape,
    frame_material: details.frame_material,
    frame_color: details.frame_color,
    lens_color: details.lens_color,
    lens_type: details.lens_type,
    polarized: details.polarized,
    lens_width: details.lens_width,
    bridge_width: details.bridge_width,
    temple_length: details.temple_length,
  }
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const parsedParams = StoreProductIdParamsSchema.safeParse(req.params)

  if (!parsedParams.success) {
    res.status(400).json({ message: "Invalid product id" })
    return
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: [
      "id",
      "eyewear_details.brand",
      "eyewear_details.model_name",
      "eyewear_details.gender",
      "eyewear_details.frame_shape",
      "eyewear_details.frame_material",
      "eyewear_details.frame_color",
      "eyewear_details.lens_color",
      "eyewear_details.lens_type",
      "eyewear_details.polarized",
      "eyewear_details.lens_width",
      "eyewear_details.bridge_width",
      "eyewear_details.temple_length",
    ],
    filters: { id: parsedParams.data.id },
  })

  if (!products.length) {
    res.status(404).json({ message: "Product not found" })
    return
  }

  const product = products[0] as unknown as ProductWithEyewearDetails

  res.json({ eyewear: toStoreEyewearDetails(product.eyewear_details) })
}
