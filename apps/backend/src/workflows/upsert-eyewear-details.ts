import {
  createStep,
  createWorkflow,
  StepResponse,
  transform,
  when,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import {
  createRemoteLinkStep,
  emitEventStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import {
  EYEWEAR_MODULE,
  EYEWEAR_SEARCH_REINDEX_EVENT,
} from "../modules/eyewear"
import EyewearModuleService from "../modules/eyewear/service"
import {
  EYEWEAR_GENDER_VALUES,
  EYEWEAR_LENS_TYPE_VALUES,
} from "../modules/eyewear/models/eyewear-details"

export type UpsertEyewearDetailsInput = {
  product_id: string
  data: {
    brand: string
    model_name?: string | null
    gender?: (typeof EYEWEAR_GENDER_VALUES)[number] | null
    frame_shape?: string | null
    frame_material?: string | null
    frame_color?: string | null
    lens_color?: string | null
    lens_type?: (typeof EYEWEAR_LENS_TYPE_VALUES)[number] | null
    polarized?: boolean
    lens_width?: number | null
    bridge_width?: number | null
    temple_length?: number | null
  }
}

const upsertEyewearDetailsStep = createStep(
  "upsert-eyewear-details",
  async (
    input: {
      product_id: string
      existing_eyewear_details_id?: string | null
      data: UpsertEyewearDetailsInput["data"]
    },
    { container }
  ) => {
    const eyewearModuleService: EyewearModuleService = container.resolve(
      EYEWEAR_MODULE
    )

    if (input.existing_eyewear_details_id) {
      const previousData = await eyewearModuleService.retrieveEyewearDetails(
        input.existing_eyewear_details_id
      )
      const eyewearDetails = await eyewearModuleService.updateEyewearDetails({
        id: input.existing_eyewear_details_id,
        ...input.data,
      })

      return new StepResponse(
        { eyewearDetails, created: false },
        { id: input.existing_eyewear_details_id, previousData }
      )
    }

    const eyewearDetails = await eyewearModuleService.createEyewearDetails(
      input.data
    )

    return new StepResponse(
      { eyewearDetails, created: true },
      { id: eyewearDetails.id }
    )
  },
  async (
    compensationData: { id: string; previousData?: Record<string, unknown> } | undefined,
    { container }
  ) => {
    if (!compensationData) {
      return
    }

    const eyewearModuleService: EyewearModuleService = container.resolve(
      EYEWEAR_MODULE
    )

    if (compensationData.previousData) {
      await eyewearModuleService.updateEyewearDetails({
        id: compensationData.id,
        ...compensationData.previousData,
      })
      return
    }

    await eyewearModuleService.deleteEyewearDetails(compensationData.id)
  }
)

const upsertEyewearDetailsWorkflow = createWorkflow(
  "upsert-eyewear-details",
  (input: UpsertEyewearDetailsInput) => {
    const { data: productData } = useQueryGraphStep({
      entity: "product",
      fields: ["id", "eyewear_details.id"],
      filters: { id: input.product_id },
      options: { throwIfKeyNotFound: true },
    }) as unknown as {
      data: { id: string; eyewear_details?: { id: string } | null }[]
    }

    const existingEyewearDetailsId = transform(
      { productData },
      ({ productData }) => productData[0]?.eyewear_details?.id ?? null
    )

    const { eyewearDetails, created } = upsertEyewearDetailsStep({
      product_id: input.product_id,
      existing_eyewear_details_id: existingEyewearDetailsId,
      data: input.data,
    })

    when({ created }, ({ created }) => created).then(() => {
      createRemoteLinkStep([
        {
          [Modules.PRODUCT]: {
            product_id: input.product_id,
          },
          [EYEWEAR_MODULE]: {
            eyewear_details_id: eyewearDetails.id,
          },
        },
      ])
    })

    emitEventStep({
      eventName: EYEWEAR_SEARCH_REINDEX_EVENT,
      data: { id: input.product_id },
    })

    return new WorkflowResponse({ eyewearDetails, created })
  }
)

export default upsertEyewearDetailsWorkflow
