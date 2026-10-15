import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

export type StoreBankTransferDetails = {
  account_holder: string | null
  iban: string | null
  bic: string | null
  bank_name: string | null
}

/**
 * Public, read-only bank details for the "Bonifico bancario" payment method
 * (account holder/IBAN/BIC/bank name — not secrets, meant to be shown to
 * the customer). Single source of truth: the same env vars medusa-config.ts
 * reads to configure the bank-transfer payment provider, so the storefront
 * never hardcodes these values. Missing fields are returned as `null`
 * rather than the string "undefined".
 */
export async function GET(
  _req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const details: StoreBankTransferDetails = {
    account_holder: process.env.BANK_TRANSFER_ACCOUNT_HOLDER || null,
    iban: process.env.BANK_TRANSFER_IBAN || null,
    bic: process.env.BANK_TRANSFER_BIC || null,
    bank_name: process.env.BANK_TRANSFER_BANK_NAME || null,
  }

  res.json({ bank_transfer: details })
}
