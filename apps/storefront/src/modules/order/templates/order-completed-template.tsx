import { Heading } from "@modules/common/components/ui"

import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Help from "@modules/order/components/help"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import ShippingDetails from "@modules/order/components/shipping-details"
import PaymentDetails from "@modules/order/components/payment-details"
import { HttpTypes } from "@medusajs/types"

type OrderCompletedTemplateProps = {
  order: HttpTypes.StoreOrder
}

export default async function OrderCompletedTemplate({
  order,
}: OrderCompletedTemplateProps) {
  return (
    <div className="py-6 min-h-[calc(100vh-64px)]">
      <div className="content-container flex h-full w-full max-w-4xl flex-col items-center justify-center gap-y-10">
        <div
          className="flex h-full w-full max-w-4xl flex-col gap-4 rounded-card border border-border bg-surface py-10"
          data-testid="order-complete-container"
        >
          <Heading
            level="h1"
            className="mb-4 flex flex-col gap-y-3 font-serif text-3xl text-foreground"
          >
            <span>Grazie!</span>
            <span>Il tuo ordine è stato registrato con successo.</span>
          </Heading>
          <OrderDetails order={order} showStatus />
          <Heading level="h2" className="text-xl font-medium text-foreground">
            Riepilogo
          </Heading>
          <Items order={order} />
          <CartTotals totals={order} />
          <ShippingDetails order={order} />
          <PaymentDetails order={order} />
          <Help />
          <LocalizedClientLink
            href="/shop"
            className="mt-4 self-start text-sm text-coffee underline"
          >
            Torna al catalogo
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
