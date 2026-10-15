"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { ShoppingBag } from "@medusajs/icons"
import { HttpTypes } from "@medusajs/types"
import { Button, Text } from "@modules/common/components/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LineItemUnitPrice from "@modules/common/components/line-item-unit-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"

const CartDropdown = ({
  cart: cartState,
}: {
  cart?: HttpTypes.StoreCart | null
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()

    const timer = setTimeout(close, 5000)

    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) {
      clearTimeout(activeTimer)
    }

    open()
  }

  // Clean up the timer when the component unmounts
  useEffect(() => {
    return () => {
      if (activeTimer) {
        clearTimeout(activeTimer)
      }
    }
  }, [activeTimer])

  const pathname = usePathname()

  // open cart dropdown when modifying the cart items, but only if we're not on the cart page
  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          <LocalizedClientLink
            className="relative flex items-center hover:text-coffee"
            href="/cart"
            data-testid="nav-cart-link"
            aria-label={`Carrello, ${totalItems} articoli`}
          >
            <ShoppingBag />
            {totalItems > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-coffee text-[10px] text-white">
                {totalItems}
              </span>
            )}
          </LocalizedClientLink>
        </PopoverButton>
        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 w-[380px] rounded-card border border-border bg-background text-foreground shadow-lg"
            data-testid="nav-cart-dropdown"
          >
            <div className="flex items-center justify-center border-b border-border p-4">
              <h3 className="text-sm font-medium uppercase tracking-wide text-foreground">
                Il tuo carrello
              </h3>
            </div>
            {cartState && cartState.items?.length ? (
              <>
                <div className="grid max-h-[380px] grid-cols-1 gap-y-6 overflow-y-scroll p-4 no-scrollbar">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[72px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="aspect-[4/5] w-full overflow-hidden rounded-card bg-cream"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>
                        <div className="flex flex-1 flex-col justify-between">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-x-2">
                              <div className="flex flex-col overflow-hidden">
                                <Text className="truncate text-sm font-medium text-foreground">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </Text>
                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />
                                <div className="flex items-center gap-x-2 text-xs text-muted">
                                  <span
                                    data-testid="cart-item-quantity"
                                    data-value={item.quantity}
                                  >
                                    Quantità: {item.quantity}
                                  </span>
                                  <span aria-hidden>·</span>
                                  <LineItemUnitPrice
                                    item={item}
                                    style="tight"
                                    currencyCode={cartState.currency_code}
                                  />
                                </div>
                              </div>
                              <LineItemPrice
                                item={item}
                                style="tight"
                                currencyCode={cartState.currency_code}
                              />
                            </div>
                          </div>
                          <DeleteButton
                            id={item.id}
                            className="mt-1 text-xs text-muted hover:text-coffee"
                            data-testid="cart-item-remove-button"
                          >
                            Rimuovi
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>
                <div className="flex flex-col gap-y-4 border-t border-border p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-foreground">
                      Subtotale{" "}
                      <span className="font-normal text-muted">(IVA esclusa)</span>
                    </span>
                    <span
                      className="text-base font-medium text-foreground"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>
                  <div className="flex gap-x-3">
                    <LocalizedClientLink href="/cart" passHref className="flex-1">
                      <Button
                        variant="coffee-outline"
                        className="w-full"
                        data-testid="go-to-cart-button"
                      >
                        Vai al carrello
                      </Button>
                    </LocalizedClientLink>
                    <LocalizedClientLink
                      href="/checkout?step=address"
                      passHref
                      className="flex-1"
                    >
                      <Button
                        variant="coffee"
                        className="w-full"
                        data-testid="go-to-checkout-button"
                      >
                        Checkout
                      </Button>
                    </LocalizedClientLink>
                  </div>
                </div>
              </>
            ) : (
              <div>
                <div className="flex flex-col items-center justify-center gap-y-4 py-16">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-cream text-foreground">
                    <ShoppingBag className="h-5 w-5" />
                  </div>
                  <span className="text-sm text-muted">
                    Il tuo carrello è vuoto.
                  </span>
                  <div>
                    <LocalizedClientLink href="/shop">
                      <>
                        <span className="sr-only">Vai al catalogo</span>
                        <Button variant="coffee" onClick={close}>
                          Scopri il catalogo
                        </Button>
                      </>
                    </LocalizedClientLink>
                  </div>
                </div>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
