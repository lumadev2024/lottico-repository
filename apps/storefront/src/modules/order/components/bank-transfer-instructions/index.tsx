import { HttpTypes } from "@medusajs/types"
import { retrieveBankTransferDetails } from "@lib/data/bank-transfer"
import { convertToLocale } from "@lib/util/money"
import { Badge, Text } from "@modules/common/components/ui"

type BankTransferInstructionsProps = {
  order: HttpTypes.StoreOrder
}

const FIELD_LABELS = {
  account_holder: "Intestatario",
  iban: "IBAN",
  bic: "BIC",
  bank_name: "Banca",
} as const

/**
 * Shown on the order confirmation while a bank-transfer payment session is
 * still "pending_authorization" (no Payment record exists yet — see
 * `apps/backend/src/modules/bank-transfer/service.ts`). Account
 * holder/IBAN/BIC/bank name come from the backend's own env config via a
 * public store endpoint, never hardcoded here.
 */
const BankTransferInstructions = async ({
  order,
}: BankTransferInstructionsProps) => {
  const details = await retrieveBankTransferDetails()

  const configuredFields = (
    ["account_holder", "iban", "bic", "bank_name"] as const
  ).filter((field) => details?.[field])

  const isDevelopment = process.env.NODE_ENV !== "production"
  const missingRequired = !details?.account_holder || !details?.iban

  return (
    <div className="flex flex-col gap-y-3" data-testid="bank-transfer-instructions">
      <div className="flex items-center gap-x-2">
        <Text className="text-sm font-medium uppercase tracking-wide text-foreground">
          Pagamento: in attesa di bonifico
        </Text>
        <Badge color="orange">In attesa</Badge>
      </div>

      {missingRequired ? (
        isDevelopment ? (
          <Text className="text-sm text-muted">
            Configurazione IBAN mancante (sviluppo): imposta
            BANK_TRANSFER_ACCOUNT_HOLDER e BANK_TRANSFER_IBAN nel backend per
            mostrare qui i dati del bonifico.
          </Text>
        ) : (
          <Text className="text-sm text-muted">
            I dati per il bonifico non sono al momento disponibili.
            Contattaci per ricevere le coordinate bancarie.
          </Text>
        )
      ) : (
        <dl className="flex flex-col gap-y-2 text-sm">
          {configuredFields.map((field) => (
            <div key={field} className="flex items-center justify-between">
              <dt className="text-muted">{FIELD_LABELS[field]}</dt>
              <dd className="font-medium text-foreground">{details?.[field]}</dd>
            </div>
          ))}
          <div className="flex items-center justify-between">
            <dt className="text-muted">Importo</dt>
            <dd className="font-medium text-foreground">
              {convertToLocale({
                amount: order.total,
                currency_code: order.currency_code,
              })}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="text-muted">Causale</dt>
            <dd className="font-medium text-foreground">
              Ordine #{order.display_id}
            </dd>
          </div>
        </dl>
      )}

      <Text className="text-xs text-muted">
        Indica il numero ordine nella causale del bonifico. L&apos;ordine
        verrà elaborato dopo la conferma dell&apos;accredito.
      </Text>
    </div>
  )
}

export default BankTransferInstructions
