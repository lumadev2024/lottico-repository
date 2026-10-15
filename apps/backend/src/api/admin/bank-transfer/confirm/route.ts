import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { authorizePaymentSessionForOrderWorkflow } from "@medusajs/core-flows"
import { z } from "@medusajs/framework/zod"
import confirmBankTransferSessionWorkflow from "../../../../workflows/confirm-bank-transfer-session"

const ConfirmBankTransferSchema = z.object({
  payment_session_id: z.string().min(1),
})

/**
 * Minimal manual-confirmation extension for the bank-transfer provider: no
 * stock Medusa action exists to tell an offline provider "the money
 * arrived" (see architecture discussion), so this route flips the session's
 * `confirmed` flag (via its own workflow) and re-runs Medusa's own
 * authorization workflow — the same one the stock Admin "Check status"
 * action calls. No custom payment logic lives here, only the one bit the
 * provider needs to change its answer.
 */
export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const parsed = ConfirmBankTransferSchema.safeParse(req.body)

  if (!parsed.success) {
    res.status(400).json({ message: "Invalid payload", errors: parsed.error.issues })
    return
  }

  const { payment_session_id } = parsed.data

  await confirmBankTransferSessionWorkflow(req.scope).run({
    input: { payment_session_id },
  })

  const { result: payment } = await authorizePaymentSessionForOrderWorkflow(
    req.scope
  ).run({
    input: { payment_session_id },
  })

  res.json({ authorized: Boolean(payment) })
}
