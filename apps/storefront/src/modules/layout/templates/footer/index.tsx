import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@modules/common/components/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Legal pages are not implemented yet: these labels are shown (per the brief)
// without fabricating policy content or routes. Replace `#` once the real
// pages exist.
const LEGAL_LINKS = [
  "Privacy",
  "Cookie",
  "Condizioni di vendita",
  "Spedizioni e resi",
]

// No real social profiles configured yet: shown as inert labels rather than
// links to an account that may not exist.
const SOCIAL_PLACEHOLDERS = ["Instagram", "Facebook"]

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "id,handle,title",
  })
  const productCategories = await listCategories()

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="content-container flex w-full flex-col">
        <div className="grid grid-cols-2 gap-x-8 gap-y-10 py-16 small:grid-cols-5 small:py-24">
          <div className="col-span-2 flex flex-col gap-y-3 small:col-span-1">
            <LocalizedClientLink href="/" className="w-fit" aria-label="L'Ottico">
              <Image
                src="/images/brand/logo-mark.png"
                alt="L'Ottico"
                width={160}
                height={61}
                className="h-10 w-auto invert"
              />
            </LocalizedClientLink>
            <Text className="text-sm text-muted">
              Boutique eyewear e consulenza in negozio a Secondigliano, Napoli.
            </Text>
          </div>

          {productCategories && productCategories.length > 0 && (
            <div className="flex flex-col gap-y-3">
              <span className="text-xs font-medium uppercase tracking-wide text-foreground">
                Shop
              </span>
              <ul className="grid grid-cols-1 gap-y-2" data-testid="footer-categories">
                {productCategories.slice(0, 6).map((c) => {
                  if (c.parent_category) {
                    return null
                  }

                  return (
                    <li key={c.id}>
                      <LocalizedClientLink
                        className="text-sm text-muted hover:text-coffee"
                        href={`/categories/${c.handle}`}
                        data-testid="category-link"
                      >
                        {c.name}
                      </LocalizedClientLink>
                    </li>
                  )
                })}
              </ul>
            </div>
          )}

          {collections && collections.length > 0 && (
            <div className="flex flex-col gap-y-3">
              <span className="text-xs font-medium uppercase tracking-wide text-foreground">
                Collezioni
              </span>
              <ul className="grid grid-cols-1 gap-y-2">
                {collections.slice(0, 6).map((c) => (
                  <li key={c.id}>
                    <LocalizedClientLink
                      className="text-sm text-muted hover:text-coffee"
                      href={`/collections/${c.handle}`}
                    >
                      {c.title}
                    </LocalizedClientLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex flex-col gap-y-3">
            <span className="text-xs font-medium uppercase tracking-wide text-foreground">
              Negozio
            </span>
            <ul className="grid grid-cols-1 gap-y-2">
              <li>
                <LocalizedClientLink
                  href="/#visita"
                  className="text-sm text-muted hover:text-coffee"
                >
                  Visita in sede
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink
                  href="/#contatti"
                  className="text-sm text-muted hover:text-coffee"
                >
                  Contatti
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-y-3">
            <span className="text-xs font-medium uppercase tracking-wide text-foreground">
              Informazioni
            </span>
            <ul className="grid grid-cols-1 gap-y-2">
              {LEGAL_LINKS.map((label) => (
                <li key={label}>
                  <a href="#" className="text-sm text-muted hover:text-coffee">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div
          className={clx(
            "flex w-full flex-col items-start gap-y-4 border-t border-border py-8",
            "small:flex-row small:items-center small:justify-between"
          )}
        >
          <Text className="text-xs text-muted">
            © {new Date().getFullYear()} L&apos;Ottico. Tutti i diritti riservati.
          </Text>
          <div className="flex items-center gap-x-4">
            {SOCIAL_PLACEHOLDERS.map((label) => (
              <span key={label} className="text-xs text-muted/60">
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
