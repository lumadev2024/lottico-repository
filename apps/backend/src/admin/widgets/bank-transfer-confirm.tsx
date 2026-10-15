import { useEffect, useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps, AdminOrder } from "@medusajs/framework/types"
import { Badge, Button, Container, Heading, Text, toast } from "@medusajs/ui"

type BankTransferSession = {
  id: string
  provider_id: string
  status: string
}

const findBankTransferSession = (order: {
  payment_collections?: {
    payment_sessions?: { id: string; provider_id: string; status: string }[]
  }[]
}): BankTransferSession | null => {
  for (const collection of order.payment_collections ?? []) {
    for (const session of collection.payment_sessions ?? []) {
      if (session.provider_id?.startsWith("pp_bank_transfer")) {
        return session
      }
    }
  }
  return null
}

/**
 * The bank-transfer payment provider has no gateway to poll, so nothing
 * tells Medusa automatically when a wire transfer lands. This widget is the
 * one manual step an operator needs: confirm the money arrived, which
 * flips the payment session and re-runs Medusa's own authorization
 * workflow (`POST /admin/bank-transfer/confirm`). After that, the stock
 * "Capture payment" action in Medusa Admin works as usual.
 */
const BankTransferConfirmWidget = ({
  data: order,
}: DetailWidgetProps<AdminOrder>) => {
  const [session, setSession] = useState<BankTransferSession | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirming, setIsConfirming] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadSession = async () => {
      try {
        const response = await fetch(
          `/admin/orders/${order.id}?fields=id,+payment_collections.payment_sessions.id,+payment_collections.payment_sessions.provider_id,+payment_collections.payment_sessions.status`,
          { credentials: "include" }
        )

        if (!response.ok) {
          throw new Error("Failed to load order payment sessions")
        }

        const json = await response.json()
        const found = findBankTransferSession(json.order)

        if (isMounted) {
          setSession(found)
        }
      } catch (error) {
        // Non-fatal: the widget simply won't show if we can't tell whether
        // this order uses bank transfer.
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadSession()

    return () => {
      isMounted = false
    }
  }, [order.id])

  if (isLoading || !session || session.status !== "pending_authorization") {
    return null
  }

  const handleConfirm = async () => {
    setIsConfirming(true)

    try {
      const response = await fetch("/admin/bank-transfer/confirm", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_session_id: session.id }),
      })

      if (!response.ok) {
        throw new Error("Failed to confirm bank transfer")
      }

      toast.success("Bonifico bancario", {
        description:
          "Bonifico confermato. Il pagamento può ora essere incassato (capture) dalla sezione Pagamento dell'ordine.",
      })

      setSession({ ...session, status: "authorized" })
    } catch (error) {
      toast.error("Bonifico bancario", {
        description: "Conferma non riuscita. Riprova.",
      })
    } finally {
      setIsConfirming(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Bonifico bancario</Heading>
        <Badge color="orange">In attesa di bonifico</Badge>
      </div>
      <div className="flex flex-col gap-y-4 px-6 py-4">
        <Text size="small" className="text-ui-fg-subtle">
          Questo ordine è stato pagato tramite bonifico bancario e non è
          ancora stato confermato. Verifica sul conto corrente che
          l&apos;accredito con la causale "Ordine #{order.display_id}" sia
          arrivato, poi conferma qui sotto.
        </Text>
        <div className="flex justify-end">
          <Button
            variant="primary"
            size="small"
            onClick={handleConfirm}
            isLoading={isConfirming}
          >
            Conferma bonifico ricevuto
          </Button>
        </div>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "order.details.before",
})

export default BankTransferConfirmWidget
