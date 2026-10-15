import { defineSearchIndex, graphConsume, graphSeed } from "@medusajs/framework/utils";

import {
  PRODUCT_EVENTS,
  ProductRow,
  productFields,
  source,
} from "./helpers/document";
import { resolveProductIds } from "./helpers/resolve-product-ids";

export default defineSearchIndex({
  name: "product",
  entity: "product",
  primary_key: "id",
  fields: productFields,
  settings: {
    typo_tolerance: { enabled: true },
  },
  events: PRODUCT_EVENTS,
  consume: graphConsume<typeof productFields, ProductRow>({
    ...source,
    resolve_ids: resolveProductIds,
    is_delete: (event) => event.name === "product.deleted",
  }),
  seed: graphSeed<typeof productFields, ProductRow>(source),
});
