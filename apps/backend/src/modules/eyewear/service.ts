import { MedusaService } from "@medusajs/framework/utils"
import EyewearDetails from "./models/eyewear-details"

class EyewearModuleService extends MedusaService({
  EyewearDetails,
}) {}

export default EyewearModuleService
