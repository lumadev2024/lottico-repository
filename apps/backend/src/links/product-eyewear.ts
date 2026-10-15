import ProductModule from "@medusajs/medusa/product"
import { defineLink } from "@medusajs/framework/utils"
import EyewearModule from "../modules/eyewear"

export default defineLink(ProductModule.linkable.product, {
  linkable: EyewearModule.linkable.eyewearDetails,
  deleteCascade: true,
})
