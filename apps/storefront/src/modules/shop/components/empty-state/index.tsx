import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function EmptyState({ hasFilters }: { hasFilters: boolean }) {
  return (
    <div className="flex flex-col items-center gap-y-4 py-24 text-center">
      <p className="text-base text-foreground">
        {hasFilters
          ? "Nessun occhiale corrisponde ai filtri selezionati."
          : "Nessun prodotto disponibile al momento."}
      </p>
      {hasFilters && (
        <LocalizedClientLink
          href="/shop"
          className="text-sm text-coffee underline"
        >
          Azzera filtri
        </LocalizedClientLink>
      )}
    </div>
  )
}
