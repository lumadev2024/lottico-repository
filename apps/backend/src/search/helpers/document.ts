import type { SearchTypes } from "@medusajs/framework/types";
import { search } from "@medusajs/framework/utils";

import { ProductOptionRow, toOptionValues } from "./option-values";
import { loadPricing, priceFields, toProductPricing } from "./pricing";
import { EYEWEAR_SEARCH_REINDEX_EVENT } from "../../modules/eyewear";

/**
 * Kept apart from `product.ts` so it can be imported in a unit test:
 * `defineSearchIndex` registers itself into a registry only the Medusa
 * loader sets up, so importing the file that calls it outside the app
 * (e.g. under plain Jest) throws before anything in this module ever runs.
 */

export const PRODUCT_GRAPH_FIELDS = [
  "id",
  "title",
  "description",
  "handle",
  "thumbnail",
  "status",
  "created_at",
  "sales_channels.id",
  "categories.name",
  "tags.value",
  "options.title",
  "options.values.value",
  "eyewear_details.brand",
  "eyewear_details.model_name",
  "eyewear_details.gender",
  "eyewear_details.frame_shape",
  "eyewear_details.frame_material",
  "eyewear_details.frame_color",
  "eyewear_details.lens_color",
  "eyewear_details.lens_type",
  "eyewear_details.polarized",
];

export type EyewearDetailsRow = {
  brand?: string | null;
  model_name?: string | null;
  gender?: string | null;
  frame_shape?: string | null;
  frame_material?: string | null;
  frame_color?: string | null;
  lens_color?: string | null;
  lens_type?: string | null;
  polarized?: boolean | null;
} | null;

export type ProductRow = {
  id: string;
  title?: string | null;
  description?: string | null;
  handle?: string | null;
  thumbnail?: string | null;
  status?: string | null;
  created_at?: string | Date | null;
  deleted_at?: string | Date | null;
  sales_channels?: ({ id?: string | null } | null)[] | null;
  categories?: ({ name?: string | null } | null)[] | null;
  tags?: ({ value?: string | null } | null)[] | null;
  options?: ProductOptionRow[] | null;
  eyewear_details?: EyewearDetailsRow;
};

export const productFields = search.define({
  id: search.keyword().filterable().retrievable(),
  // Read by `/store/search` to scope the index; never returned to hits.
  status: search.keyword().filterable().retrievable(false),
  sales_channel_ids: search.keyword().array().filterable().retrievable(false),
  title: search.text().searchable({ weight: 3 }).sortable().retrievable(),
  description: search.text().searchable({ weight: 1 }),
  handle: search.keyword().retrievable(),
  // Returned on hits only: never filtered, sorted or faceted on.
  thumbnail: search.keyword().retrievable(),
  created_at: search.date().sortable().retrievable(),
  category: search.keyword().array().filterable().facetable().retrievable(),
  labels: search.keyword().array().filterable().facetable().retrievable(),
  option_values: search
    .keyword()
    .array()
    .searchable({ weight: 2 })
    .filterable()
    .facetable()
    .retrievable(),
  // Eyewear fields: present only for products linked to EyewearDetails (see
  // `src/modules/eyewear`). Absent on every other product, written as `null`.
  brand: search
    .keyword()
    .searchable({ weight: 2 })
    .filterable()
    .facetable()
    .retrievable(),
  model_name: search.text().searchable({ weight: 2 }).retrievable(),
  gender: search.keyword().filterable().facetable().retrievable(),
  frame_shape: search
    .keyword()
    .searchable({ weight: 2 })
    .filterable()
    .facetable()
    .retrievable(),
  frame_material: search
    .keyword()
    .searchable({ weight: 2 })
    .filterable()
    .facetable()
    .retrievable(),
  frame_color: search.keyword().filterable().facetable().retrievable(),
  lens_color: search.keyword().filterable().retrievable(),
  lens_type: search.keyword().filterable().facetable().retrievable(),
  polarized: search.boolean().filterable().facetable().retrievable(),
  ...priceFields,
});

export type ProductDocument = SearchTypes.InferSearchDocumentType<
  typeof productFields
>;

export function toDocument(
  product: ProductRow,
  pricing: Parameters<typeof toProductPricing>[0],
): ProductDocument {
  const category = (product.categories ?? [])
    .map((productCategory) => productCategory?.name?.trim())
    .filter((name): name is string => Boolean(name));
  const labels = (product.tags ?? [])
    .map((tag) => tag?.value?.trim())
    .filter((value): value is string => Boolean(value));
  const salesChannelIds = (product.sales_channels ?? [])
    .map((salesChannel) => salesChannel?.id?.trim())
    .filter((id): id is string => Boolean(id));

  return {
    id: product.id,
    status: product.status ?? null,
    sales_channel_ids: salesChannelIds,
    title: product.title ?? null,
    description: product.description ?? null,
    handle: product.handle ?? null,
    thumbnail: product.thumbnail ?? null,
    created_at: product.created_at ?? null,
    category,
    labels,
    option_values: toOptionValues(product.options),
    brand: product.eyewear_details?.brand ?? null,
    model_name: product.eyewear_details?.model_name ?? null,
    gender: product.eyewear_details?.gender ?? null,
    frame_shape: product.eyewear_details?.frame_shape ?? null,
    frame_material: product.eyewear_details?.frame_material ?? null,
    frame_color: product.eyewear_details?.frame_color ?? null,
    lens_color: product.eyewear_details?.lens_color ?? null,
    lens_type: product.eyewear_details?.lens_type ?? null,
    polarized: product.eyewear_details?.polarized ?? null,
    ...toProductPricing(pricing),
  };
}

/**
 * A row that returns no document leaves
 * the index: the helpers turn it into a delete on `consume` and on the
 * catch-up pass.
 */
export const source = {
  fields: PRODUCT_GRAPH_FIELDS,
  transform: async (
    rows: ProductRow[],
    context: SearchTypes.SearchIngestionContext,
  ) => {
    const pricing = await loadPricing(
      rows.map((row) => row.id),
      context,
    );

    return rows.map((row) => toDocument(row, pricing.get(row.id)));
  },
};

/**
 * Everything a document is built from, so a change to any of it re-indexes the
 * products it touches. Only `product.deleted` removes documents: a deleted
 * variant, option, tag or category means the product has to be re-read.
 *
 * TODO: price lists emit no events (create, update, delete, batch prices).
 * TODO: price lists crossing their start or end date change prices silently.
 * TODO: linkProductsToSalesChannelWorkflow emits nothing.
 * TODO: batchLinkProductsToCategoryWorkflow emits nothing.
 * TODO: upsertVariantPricesWorkflow emits nothing when called directly.
 */
export const PRODUCT_EVENTS = [
  "product.created",
  "product.updated",
  "product.deleted",
  "product-variant.created",
  "product-variant.updated",
  "product-variant.deleted",
  "product-option.created",
  "product-option.updated",
  "product-option.deleted",
  "product-option-value.updated",
  "product-option-value.deleted",
  "product-tag.updated",
  "product-tag.deleted",
  "product-category.updated",
  "product-category.deleted",
  "sales-channel.deleted",
  // Emitted directly by the eyewear workflows with the product id already in
  // the payload (see `EYEWEAR_SEARCH_REINDEX_EVENT`).
  EYEWEAR_SEARCH_REINDEX_EVENT,
];
