"use server"

import { sdk } from "@lib/config"
import { getCacheOptions } from "./cookies"

export type StoreEyewearDetails = {
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

/**
 * Mirrors `GET /store/products/:id/eyewear` in the backend. Returns `null`
 * both when the product has no linked EyewearDetails and when the request
 * fails, since the storefront treats the two the same way: nothing to show.
 */
export const retrieveProductEyewearDetails = async (
  productId: string
): Promise<StoreEyewearDetails | null> => {
  const next = {
    ...(await getCacheOptions("eyewear")),
  }

  return await sdk.client
    .fetch<{ eyewear: StoreEyewearDetails | null }>(
      `/store/products/${productId}/eyewear`,
      {
        next,
        cache: "force-cache",
      }
    )
    .then(({ eyewear }) => eyewear)
    .catch(() => null)
}
