"use server"

import { sdk } from "@lib/config"

export type StoreBankTransferDetails = {
  account_holder: string | null
  iban: string | null
  bic: string | null
  bank_name: string | null
}

/**
 * Mirrors `GET /store/payment-providers/bank-transfer` — the account
 * holder/IBAN/BIC/bank name are business config, not secrets, but they
 * still live only in the backend's env vars, never hardcoded here. A field
 * comes back `null` (not a fetch error) when it isn't configured yet.
 */
export const retrieveBankTransferDetails = async (): Promise<StoreBankTransferDetails | null> => {
  return await sdk.client
    .fetch<{ bank_transfer: StoreBankTransferDetails }>(
      "/store/payment-providers/bank-transfer",
      { cache: "no-store" }
    )
    .then(({ bank_transfer }) => bank_transfer)
    .catch(() => null)
}
