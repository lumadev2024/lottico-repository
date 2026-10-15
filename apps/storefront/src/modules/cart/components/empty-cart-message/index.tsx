import { Text } from "@modules/common/components/ui"

import InteractiveLink from "@modules/common/components/interactive-link"

const EmptyCartMessage = () => {
  return (
    <div
      className="flex flex-col items-start justify-center px-2 py-24"
      data-testid="empty-cart-message"
    >
      <Text className="mb-6 max-w-[32rem] text-base text-muted">
        Il tuo carrello è vuoto. Scopri la nostra selezione di occhiali da
        vista e da sole.
      </Text>
      <div>
        <InteractiveLink href="/shop">Scopri il catalogo</InteractiveLink>
      </div>
    </div>
  )
}

export default EmptyCartMessage
