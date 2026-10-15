import { toDocument, ProductRow } from "../search/helpers/document"
import { resolveProductIds } from "../search/helpers/resolve-product-ids"

const BASE_PRODUCT: ProductRow = {
  id: "prod_1",
  title: "Ray-Ban-RB2140",
  description: null,
  handle: "ray-ban-rb2140",
  thumbnail: null,
  status: "published",
  created_at: "2026-01-01T00:00:00.000Z",
  sales_channels: [],
  categories: [],
  tags: [],
  options: [],
}

describe("search/product toDocument", () => {
  it("indexes eyewear fields for a product with EyewearDetails", () => {
    const document = toDocument(
      {
        ...BASE_PRODUCT,
        eyewear_details: {
          brand: "Ray-Ban",
          model_name: "RB2140",
          gender: "unisex",
          frame_shape: "Wayfarer",
          frame_material: "Acetato",
          frame_color: "Nero",
          lens_color: "Verde",
          lens_type: "sole",
          polarized: true,
        },
      },
      undefined
    )

    expect(document).toMatchObject({
      brand: "Ray-Ban",
      model_name: "RB2140",
      gender: "unisex",
      frame_shape: "Wayfarer",
      frame_material: "Acetato",
      frame_color: "Nero",
      lens_color: "Verde",
      lens_type: "sole",
      polarized: true,
    })
  })

  it("writes null eyewear fields, without error, for a product without EyewearDetails", () => {
    const document = toDocument(
      { ...BASE_PRODUCT, eyewear_details: null },
      undefined
    )

    expect(document).toMatchObject({
      brand: null,
      model_name: null,
      gender: null,
      frame_shape: null,
      frame_material: null,
      frame_color: null,
      lens_color: null,
      lens_type: null,
      polarized: null,
    })
  })

  it("writes null eyewear fields when eyewear_details is undefined", () => {
    const document = toDocument(BASE_PRODUCT, undefined)

    expect(document.brand).toBeNull()
    expect(document.polarized).toBeNull()
  })

  it("reflects an updated brand on reindex", () => {
    const before = toDocument(
      { ...BASE_PRODUCT, eyewear_details: { brand: "Ray-Ban" } },
      undefined
    )
    const after = toDocument(
      { ...BASE_PRODUCT, eyewear_details: { brand: "Oakley" } },
      undefined
    )

    expect(before.brand).toEqual("Ray-Ban")
    expect(after.brand).toEqual("Oakley")
  })

  it("reflects an updated gender on reindex", () => {
    const before = toDocument(
      { ...BASE_PRODUCT, eyewear_details: { gender: "uomo" } },
      undefined
    )
    const after = toDocument(
      { ...BASE_PRODUCT, eyewear_details: { gender: "donna" } },
      undefined
    )

    expect(before.gender).toEqual("uomo")
    expect(after.gender).toEqual("donna")
  })

  it("removes eyewear fields from the document after EyewearDetails is deleted", () => {
    const withEyewear = toDocument(
      { ...BASE_PRODUCT, eyewear_details: { brand: "Ray-Ban" } },
      undefined
    )
    const afterDelete = toDocument(
      { ...BASE_PRODUCT, eyewear_details: null },
      undefined
    )

    expect(withEyewear.brand).toEqual("Ray-Ban")
    expect(afterDelete.brand).toBeNull()
    // the product itself must still be present in the resulting document
    expect(afterDelete.id).toEqual(BASE_PRODUCT.id)
  })
})

describe("resolveProductIds for the eyewear reindex event", () => {
  it("returns the product ids carried directly in the event payload", async () => {
    const ids = await resolveProductIds(
      { name: "eyewear_details.reindex", data: { id: "prod_1" } },
      // the eyewear_details case never calls `query`, so a minimal stub is fine
      { container: { query: {} as any } } as any
    )

    expect(ids).toEqual(["prod_1"])
  })

  it("returns every id from a batch payload", async () => {
    const ids = await resolveProductIds(
      {
        name: "eyewear_details.reindex",
        data: [{ id: "prod_1" }, { id: "prod_2" }],
      },
      { container: { query: {} as any } } as any
    )

    expect(ids).toEqual(["prod_1", "prod_2"])
  })
})
