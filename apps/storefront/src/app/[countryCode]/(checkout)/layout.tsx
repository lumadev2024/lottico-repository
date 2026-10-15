import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ChevronDown from "@modules/common/icons/chevron-down"

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative w-full bg-background small:min-h-screen">
      <div className="h-16 border-b border-border bg-background">
        <nav className="content-container flex h-full items-center justify-between">
          <LocalizedClientLink
            href="/cart"
            className="flex flex-1 basis-0 items-center gap-x-2 text-sm text-foreground/80 hover:text-coffee"
            data-testid="back-to-cart-link"
          >
            <ChevronDown className="rotate-90" size={16} />
            <span className="mt-px hidden small:block">
              Torna al carrello
            </span>
            <span className="mt-px block small:hidden">Indietro</span>
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="text-lg font-medium tracking-wide text-foreground"
            data-testid="store-link"
          >
            L&apos;Ottico
          </LocalizedClientLink>
          <div className="flex-1 basis-0" />
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
