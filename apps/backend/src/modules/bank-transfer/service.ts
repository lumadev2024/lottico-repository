import { AbstractPaymentProvider, MedusaError } from "@medusajs/framework/utils"
import type { Logger } from "@medusajs/framework/types"
import type {
  AuthorizePaymentInput,
  AuthorizePaymentOutput,
  CancelPaymentInput,
  CancelPaymentOutput,
  CapturePaymentInput,
  CapturePaymentOutput,
  DeletePaymentInput,
  DeletePaymentOutput,
  GetPaymentStatusInput,
  GetPaymentStatusOutput,
  InitiatePaymentInput,
  InitiatePaymentOutput,
  ProviderWebhookPayload,
  RefundPaymentInput,
  RefundPaymentOutput,
  RetrievePaymentInput,
  RetrievePaymentOutput,
  UpdatePaymentInput,
  UpdatePaymentOutput,
  WebhookActionResult,
} from "@medusajs/framework/types"

export type BankTransferOptions = {
  account_holder?: string
  iban?: string
  bic?: string
  bank_name?: string
}

type InjectedDependencies = {
  logger: Logger
}

/**
 * Represents an offline bank-transfer payment: there is no third-party
 * gateway, no card data, and no automatic confirmation that money arrived.
 * `authorizePayment` returns "pending_authorization" (Medusa's documented
 * status for deferred/async methods) until an operator confirms the wire
 * transfer landed — see `POST /admin/bank-transfer/confirm`, which flips
 * `data.confirmed` and re-invokes authorization via Medusa's own
 * `authorizePaymentSessionForOrderWorkflow`. Until then, the order's
 * `payment_status` stays "awaiting", never "captured".
 */
class BankTransferProviderService extends AbstractPaymentProvider<BankTransferOptions> {
  static identifier = "bank_transfer"

  protected logger_: Logger
  protected options_: BankTransferOptions

  constructor(container: InjectedDependencies, options: BankTransferOptions) {
    super(container, options)
    this.logger_ = container.logger
    this.options_ = options
  }

  static validateOptions(options: Record<string, unknown>): void {
    const isProduction = process.env.NODE_ENV === "production"
    const hasMinimumConfig = Boolean(options.account_holder && options.iban)

    if (isProduction && !hasMinimumConfig) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Bank transfer provider: account_holder and iban are required in production."
      )
    }
  }

  async initiatePayment(
    input: InitiatePaymentInput
  ): Promise<InitiatePaymentOutput> {
    return {
      id: crypto.randomUUID(),
      data: {
        ...input.data,
        confirmed: false,
      },
      status: "pending_authorization",
    }
  }

  async authorizePayment(
    input: AuthorizePaymentInput
  ): Promise<AuthorizePaymentOutput> {
    const confirmed = input.data?.confirmed === true

    return {
      data: { ...input.data },
      status: confirmed ? "authorized" : "pending_authorization",
    }
  }

  async getPaymentStatus(
    input: GetPaymentStatusInput
  ): Promise<GetPaymentStatusOutput> {
    const confirmed = input.data?.confirmed === true

    return {
      data: { ...input.data },
      status: confirmed ? "authorized" : "pending_authorization",
    }
  }

  async capturePayment(
    input: CapturePaymentInput
  ): Promise<CapturePaymentOutput> {
    // No gateway to call: capture is purely a bookkeeping confirmation that
    // the merchant has reconciled the incoming wire with this order.
    return { data: { ...input.data } }
  }

  async cancelPayment(input: CancelPaymentInput): Promise<CancelPaymentOutput> {
    return { data: { ...input.data, canceled: true } }
  }

  async deletePayment(input: DeletePaymentInput): Promise<DeletePaymentOutput> {
    return { data: { ...input.data } }
  }

  async refundPayment(input: RefundPaymentInput): Promise<RefundPaymentOutput> {
    // A bank transfer can't be refunded automatically: there is no gateway
    // to reverse. This only records that a refund was requested; the actual
    // money movement is a manual bank transfer the merchant performs
    // themselves, outside the platform.
    this.logger_.info(
      "Bank transfer refund requested — the merchant must wire the amount back manually."
    )

    return {
      data: { ...input.data, refund_requested: true },
    }
  }

  async retrievePayment(
    input: RetrievePaymentInput
  ): Promise<RetrievePaymentOutput> {
    return { data: { ...input.data } }
  }

  async updatePayment(input: UpdatePaymentInput): Promise<UpdatePaymentOutput> {
    return { data: { ...input.data } }
  }

  async getWebhookActionAndData(
    _data: ProviderWebhookPayload["payload"]
  ): Promise<WebhookActionResult> {
    // No external provider sends webhooks for a manual bank transfer.
    return { action: "not_supported" }
  }
}

export default BankTransferProviderService
