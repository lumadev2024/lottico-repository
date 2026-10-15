import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import { isBankTransfer } from "@lib/constants"

type OrderDetailsProps = {
  order: HttpTypes.StoreOrder
  showStatus?: boolean
}

const FULFILLMENT_STATUS_LABELS: Record<string, string> = {
  not_fulfilled: "Da evadere",
  partially_fulfilled: "Parzialmente evasa",
  fulfilled: "Evasa",
  partially_shipped: "Parzialmente spedita",
  shipped: "Spedita",
  partially_delivered: "Parzialmente consegnata",
  delivered: "Consegnata",
  canceled: "Annullata",
}

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  not_paid: "Da pagare",
  awaiting: "In attesa",
  authorized: "Confermato, in attesa di incasso",
  partially_authorized: "Parzialmente confermato",
  captured: "Pagato",
  partially_captured: "Parzialmente pagato",
  refunded: "Rimborsato",
  partially_refunded: "Parzialmente rimborsato",
  canceled: "Annullato",
}

const OrderDetails = ({ order, showStatus }: OrderDetailsProps) => {
  const formatStatus = (
    str: string,
    labels: Record<string, string>
  ) => labels[str] ?? str.slice(0, 1).toUpperCase() + str.slice(1).split("_").join(" ")

  const hasPendingBankTransfer = order.payment_collections?.some((pc) =>
    pc.payment_sessions?.some(
      (ps) => isBankTransfer(ps.provider_id) && ps.status === "pending_authorization"
    )
  )

  const paymentStatusLabel =
    hasPendingBankTransfer && order.payment_status === "awaiting"
      ? "In attesa di bonifico"
      : formatStatus(order.payment_status, PAYMENT_STATUS_LABELS)

  return (
    <div>
      <Text className="text-sm text-muted">
        Abbiamo inviato i dettagli di conferma dell&apos;ordine a{" "}
        <span
          className="font-semibold text-foreground"
          data-testid="order-email"
        >
          {order.email}
        </span>
        .
      </Text>
      <Text className="mt-2 text-sm text-muted">
        Data ordine:{" "}
        <span data-testid="order-date">
          {new Date(order.created_at).toLocaleDateString("it-IT")}
        </span>
      </Text>
      <Text className="mt-2 text-coffee">
        Numero ordine: <span data-testid="order-id">{order.display_id}</span>
      </Text>

      <div className="mt-4 flex items-center gap-x-4 text-sm">
        {showStatus && (
          <>
            <Text className="text-muted">
              Stato ordine:{" "}
              <span className="text-foreground" data-testid="order-status">
                {formatStatus(order.fulfillment_status, FULFILLMENT_STATUS_LABELS)}
              </span>
            </Text>
            <Text className="text-muted">
              Stato pagamento:{" "}
              <span
                className="text-foreground"
                data-testid="order-payment-status"
              >
                {paymentStatusLabel}
              </span>
            </Text>
          </>
        )}
      </div>
    </div>
  )
}

export default OrderDetails
