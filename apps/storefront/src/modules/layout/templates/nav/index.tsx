import Image from "next/image"
import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { User } from "@medusajs/icons"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale, categories, { collections }] =
    await Promise.all([
      listRegions().then((regions: StoreRegion[]) => regions),
      listLocales(),
      getLocale(),
      listCategories(),
      listCollections({ fields: "id,handle,title" }),
    ])

  const vista = categories?.find((c) => c.handle === "da vista")
  const sole = categories?.find((c) => c.handle === "da sole")
  const novita = collections?.find((c) => c.handle === "nuovi arrivi")

  const primaryLinks = [
    { label: "Catalogo", href: "/shop" },
    novita && { label: "Novità", href: `/collections/${novita.handle}` },
    vista && { label: "Occhiali da vista", href: `/categories/${vista.handle}` },
    sole && { label: "Occhiali da sole", href: `/categories/${sole.handle}` },
    { label: "Brand", href: "/#brand" },
    { label: "Visita in sede", href: "/#visita" },
    { label: "Contatti", href: "/#contatti" },
  ].filter((link): link is { label: string; href: string } => Boolean(link))

  const mobileLinks = [
    ...primaryLinks,
    { label: "Account", href: "/account" },
  ]

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <header className="relative h-16 w-full bg-coffee">
        <nav className="content-container flex h-full w-full items-center justify-between text-sm text-white">
          <div className="flex h-full flex-1 basis-0 items-center gap-x-2">
            <div className="h-full small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
                links={mobileLinks}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="flex items-center"
              data-testid="nav-store-link"
              aria-label="L'Ottico"
            >
              <Image
                src="/images/brand/logo-wordmark.png"
                alt="L'Ottico"
                width={220}
                height={50}
                priority
                className="h-7 w-auto shrink-0"
              />
            </LocalizedClientLink>
          </div>

          <div className="hidden h-full items-center gap-x-7 small:flex">
            {primaryLinks.map((link) => (
              <LocalizedClientLink
                key={link.label}
                href={link.href}
                className="text-white/80 transition-colors hover:text-white"
              >
                {link.label}
              </LocalizedClientLink>
            ))}
          </div>

          <div className="flex h-full flex-1 basis-0 items-center justify-end gap-x-5">
            <Search />
            <LocalizedClientLink
              className="hidden items-center text-white/80 hover:text-white small:flex"
              href="/account"
              data-testid="nav-account-link"
              aria-label="Account"
            >
              <User />
            </LocalizedClientLink>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="flex items-center gap-2 text-white/80 hover:text-white"
                  href="/cart"
                  data-testid="nav-cart-link"
                  aria-label="Carrello"
                >
                  <span className="h-5 w-5" />
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
