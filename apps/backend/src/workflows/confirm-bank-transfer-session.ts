import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { MedusaError, Modules } from "@medusajs/framework/utils"
import type { IPaymentModuleService } from "@medusajs/framework/types"

export type ConfirmBankTransferSessionInput = {
  payment_session_id: string
}

/**
 * Flips the bank-transfer payment session's `confirmed` flag so its
 * `authorizePayment` implementation reports the wire as received the next
 * time it's invoked (by `authorizePaymentSessionForOrderWorkflow`, called
 * right after this one from the API route). This is bookkeeping only — no
 * money moves, no gateway is contacted.
 */
const confirmBankTransferSessionStep = createStep(
  "confirm-bank-transfer-session",
  async (input: ConfirmBankTransferSessionInput, { container }) => {
    const paymentModuleService: IPaymentModuleService = container.resolve(
      Modules.PAYMENT
    )

    const session = await paymentModuleService.retrievePaymentSession(
      input.payment_session_id
    )

    if (!session.provider_id?.startsWith("pp_bank_transfer")) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "This payment session doesn't use the bank transfer provider."
      )
    }

    await paymentModuleService.updatePaymentSession({
      id: session.id,
      amount: session.amount,
      currency_code: session.currency_code,
      data: { ...session.data, confirmed: true },
    })

    return new StepResponse(
      { confirmed: true },
      { id: session.id, previousData: session.data }
    )
  },
  async (
    compensationData: { id: string; previousData?: Record<string, unknown> } | undefined,
    { container }
  ) => {
    if (!compensationData) {
      return
    }

    const paymentModuleService: IPaymentModuleService = container.resolve(
      Modules.PAYMENT
    )

    const session = await paymentModuleService.retrievePaymentSession(
      compensationData.id
    )

    await paymentModuleService.updatePaymentSession({
      id: compensationData.id,
      amount: session.amount,
      currency_code: session.currency_code,
      data: compensationData.previousData ?? {},
    })
  }
)

const confirmBankTransferSessionWorkflow = createWorkflow(
  "confirm-bank-transfer-session",
  (input: ConfirmBankTransferSessionInput) => {
    const result = confirmBankTransferSessionStep(input)
    return new WorkflowResponse(result)
  }
)

export default confirmBankTransferSessionWorkflow
