import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { Modules } from "@medusajs/framework/utils"
import {
  dismissRemoteLinkStep,
  emitEventStep,
  useQueryGraphStep,
} from "@medusajs/medusa/core-flows"
import {
  EYEWEAR_MODULE,
  EYEWEAR_SEARCH_REINDEX_EVENT,
} from "../modules/eyewear"
import EyewearModuleService from "../modules/eyewear/service"

export type DeleteEyewearDetailsInput = {
  product_id: string
  eyewear_details_id: string
}

const deleteEyewearDetailsStep = createStep(
  "delete-eyewear-details",
  async (input: { eyewear_details_id: string }, { container }) => {
    const eyewearModuleService: EyewearModuleService = container.resolve(
      EYEWEAR_MODULE
    )

    const previousData = await eyewearModuleService.retrieveEyewearDetails(
      input.eyewear_details_id
    )

    await eyewearModuleService.deleteEyewearDetails(input.eyewear_details_id)

    return new StepResponse(void 0, previousData)
  },
  async (previousData, { container }) => {
    if (!previousData) {
      return
    }

    const eyewearModuleService: EyewearModuleService = container.resolve(
      EYEWEAR_MODULE
    )

    await eyewearModuleService.createEyewearDetails(previousData)
  }
)

const deleteEyewearDetailsWorkflow = createWorkflow(
  "delete-eyewear-details",
  (input: DeleteEyewearDetailsInput) => {
    useQueryGraphStep({
      entity: "product",
      fields: ["id"],
      filters: { id: input.product_id },
      options: { throwIfKeyNotFound: true },
    })

    dismissRemoteLinkStep([
      {
        [Modules.PRODUCT]: {
          product_id: input.product_id,
        },
        [EYEWEAR_MODULE]: {
          eyewear_details_id: input.eyewear_details_id,
        },
      },
    ])

    deleteEyewearDetailsStep({
      eyewear_details_id: input.eyewear_details_id,
    })

    emitEventStep({
      eventName: EYEWEAR_SEARCH_REINDEX_EVENT,
      data: { id: input.product_id },
    })

    return new WorkflowResponse(void 0)
  }
)

export default deleteEyewearDetailsWorkflow
