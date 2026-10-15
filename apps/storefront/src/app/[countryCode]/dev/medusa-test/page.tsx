import { sdk } from "@lib/config"
import { retrieveProductEyewearDetails } from "@lib/data/eyewear"
import { listProducts } from "@lib/data/products"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"

export const metadata = {
  title: "Medusa integration smoke test",
}

type StoreSearchResponse = {
  results: {
    hits: { id: string; document: Record<string, unknown> }[]
    metadata: { count: number }
  }[]
}

type PageProps = {
  params: Promise<{ countryCode: string }>
}

const Section = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => (
  <section style={{ marginBottom: "2rem" }}>
    <h2 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.5rem" }}>
      {title}
    </h2>
    {children}
  </section>
)

const Ok = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: "#15803d" }}>✅ {children}</p>
)

const Fail = ({ children }: { children: React.ReactNode }) => (
  <p style={{ color: "#b91c1c" }}>❌ {children}</p>
)

export default async function MedusaTestPage({ params }: PageProps) {
  const { countryCode } = await params

  // 1. Backend reachability
  const backendUrl =
    process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000"
  let backendReachable = false
  let backendError: string | null = null

  try {
    const res = await fetch(`${backendUrl}/health`, { cache: "no-store" })
    backendReachable = res.ok
    if (!res.ok) {
      backendError = `GET /health returned ${res.status}`
    }
  } catch (error) {
    backendError = error instanceof Error ? error.message : String(error)
  }

  // 2. Products
  let products: HttpTypes.StoreProduct[] = []
  let productsError: string | null = null

  try {
    const { response } = await listProducts({
      countryCode,
      queryParams: { limit: 5 },
    })
    products = response.products
  } catch (error) {
    productsError = error instanceof Error ? error.message : String(error)
  }

  const firstProduct = products[0]

  // 3. EyewearDetails for the first product
  let eyewear: Awaited<ReturnType<typeof retrieveProductEyewearDetails>> =
    null
  let eyewearError: string | null = null

  if (firstProduct) {
    try {
      eyewear = await retrieveProductEyewearDetails(firstProduct.id)
    } catch (error) {
      eyewearError = error instanceof Error ? error.message : String(error)
    }
  }

  // 4. Custom search: filter brand = Ray-Ban
  let searchHits: StoreSearchResponse["results"][number]["hits"] = []
  let searchError: string | null = null

  try {
    const searchResult = await sdk.client.fetch<StoreSearchResponse>(
      "/store/search",
      {
        method: "POST",
        body: {
          entity: "product",
          filters: { brand: "Ray-Ban" },
        },
        cache: "no-store",
      }
    )
    searchHits = searchResult.results[0]?.hits ?? []
  } catch (error) {
    searchError = error instanceof Error ? error.message : String(error)
  }

  return (
    <div style={{ padding: "2rem", maxWidth: "48rem", margin: "0 auto" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1.5rem" }}>
        Medusa integration smoke test
      </h1>

      <Section title="1. Connessione backend">
        {backendReachable ? (
          <Ok>Backend raggiungibile su {backendUrl}</Ok>
        ) : (
          <Fail>Backend non raggiungibile ({backendError})</Fail>
        )}
      </Section>

      <Section title="2. Lista prodotti">
        {productsError ? (
          <Fail>Errore nel caricamento prodotti: {productsError}</Fail>
        ) : products.length === 0 ? (
          <Fail>Nessun prodotto trovato</Fail>
        ) : (
          <>
            <Ok>{products.length} prodotti caricati</Ok>
            <ul>
              {products.map((product) => (
                <li key={product.id}>
                  {product.title} ({product.id})
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>

      {firstProduct && (
        <Section title="3. Dettaglio primo prodotto">
          <p>
            <strong>Titolo:</strong> {firstProduct.title}
          </p>
          <p>
            <strong>ID:</strong> {firstProduct.id}
          </p>
          <p>
            <strong>Varianti:</strong>{" "}
            {firstProduct.variants?.length ?? 0}
          </p>
          <ul>
            {(firstProduct.variants ?? []).map((variant) => {
              const price = (
                variant as HttpTypes.StoreProductVariant & {
                  calculated_price?: {
                    calculated_amount?: number
                    currency_code?: string
                  }
                }
              ).calculated_price

              return (
                <li key={variant.id}>
                  {variant.title} —{" "}
                  {price?.calculated_amount != null && price.currency_code
                    ? convertToLocale({
                        amount: price.calculated_amount,
                        currency_code: price.currency_code,
                      })
                    : "prezzo non disponibile"}
                </li>
              )
            })}
          </ul>
        </Section>
      )}

      <Section title="4. EyewearDetails">
        {eyewearError ? (
          <Fail>Errore nel caricamento EyewearDetails: {eyewearError}</Fail>
        ) : !firstProduct ? (
          <Fail>Nessun prodotto su cui verificare EyewearDetails</Fail>
        ) : !eyewear ? (
          <Fail>
            Il prodotto &quot;{firstProduct.title}&quot; non ha EyewearDetails
            collegati (comportamento atteso se non è un occhiale)
          </Fail>
        ) : (
          <>
            <Ok>EyewearDetails caricati per &quot;{firstProduct.title}&quot;</Ok>
            <ul>
              <li>
                <strong>brand:</strong> {eyewear.brand}
              </li>
              <li>
                <strong>model_name:</strong> {eyewear.model_name ?? "—"}
              </li>
              <li>
                <strong>gender:</strong> {eyewear.gender ?? "—"}
              </li>
              <li>
                <strong>frame_shape:</strong> {eyewear.frame_shape ?? "—"}
              </li>
              <li>
                <strong>frame_material:</strong> {eyewear.frame_material ?? "—"}
              </li>
              <li>
                <strong>lens_type:</strong> {eyewear.lens_type ?? "—"}
              </li>
              <li>
                <strong>polarized:</strong> {String(eyewear.polarized)}
              </li>
            </ul>
          </>
        )}
      </Section>

      <Section title="5. Search custom (brand = Ray-Ban)">
        {searchError ? (
          <Fail>Errore nella search: {searchError}</Fail>
        ) : searchHits.length === 0 ? (
          <Fail>Nessun risultato per brand = Ray-Ban</Fail>
        ) : (
          <>
            <Ok>{searchHits.length} risultati trovati</Ok>
            <ul>
              {searchHits.map((hit) => (
                <li key={hit.id}>
                  {String(hit.document.title)} ({hit.id})
                </li>
              ))}
            </ul>
          </>
        )}
      </Section>
    </div>
  )
}
