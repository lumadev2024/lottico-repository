import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import upsertEyewearDetailsWorkflow from "../../../../../workflows/upsert-eyewear-details"
import deleteEyewearDetailsWorkflow from "../../../../../workflows/delete-eyewear-details"
import { AdminUpsertEyewearDetailsSchema } from "./validators"

type ProductWithEyewearDetails = {
  id: string
  eyewear_details?: Record<string, unknown> | null
}

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "eyewear_details.*"],
    filters: { id: req.params.id },
  })

  if (!products.length) {
    res.status(404).json({ message: "Product not found" })
    return
  }

  const product = products[0] as unknown as ProductWithEyewearDetails

  res.json({ eyewear_details: product.eyewear_details ?? null })
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const parsed = AdminUpsertEyewearDetailsSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues })
    return
  }

  const { result } = await upsertEyewearDetailsWorkflow(req.scope).run({
    input: {
      product_id: req.params.id,
      data: parsed.data,
    },
  })

  res.json({ eyewear_details: result.eyewearDetails })
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  const { data: products } = await query.graph({
    entity: "product",
    fields: ["id", "eyewear_details.id"],
    filters: { id: req.params.id },
  })

  const product = products[0] as unknown as
    | (ProductWithEyewearDetails & { eyewear_details?: { id: string } | null })
    | undefined

  const eyewearDetailsId = product?.eyewear_details?.id

  if (!eyewearDetailsId) {
    res.status(404).json({ message: "Eyewear details not found for this product" })
    return
  }

  await deleteEyewearDetailsWorkflow(req.scope).run({
    input: {
      product_id: req.params.id,
      eyewear_details_id: eyewearDetailsId,
    },
  })

  res.status(200).json({ id: eyewearDetailsId, object: "eyewear_details", deleted: true })
}
