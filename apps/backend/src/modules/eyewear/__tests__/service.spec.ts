import { moduleIntegrationTestRunner } from "@medusajs/test-utils"
import { EYEWEAR_MODULE } from ".."
import EyewearModuleService from "../service"

moduleIntegrationTestRunner<EyewearModuleService>({
  moduleName: EYEWEAR_MODULE,
  resolve: __dirname + "/..",
  testSuite: ({ service }) => {
    describe("EyewearModuleService", () => {
      it("creates eyewear details", async () => {
        const eyewearDetails = await service.createEyewearDetails({
          brand: "Ray-Ban",
          model_name: "Aviator",
          gender: "unisex",
          lens_type: "sole",
          polarized: true,
          lens_width: 58,
          bridge_width: 14,
          temple_length: 135,
        })

        expect(eyewearDetails).toEqual(
          expect.objectContaining({
            brand: "Ray-Ban",
            model_name: "Aviator",
            gender: "unisex",
            lens_type: "sole",
            polarized: true,
            lens_width: 58,
          })
        )
      })

      it("retrieves eyewear details", async () => {
        const created = await service.createEyewearDetails({
          brand: "Persol",
        })

        const retrieved = await service.retrieveEyewearDetails(created.id)

        expect(retrieved.id).toEqual(created.id)
        expect(retrieved.brand).toEqual("Persol")
      })

      it("updates eyewear details", async () => {
        const created = await service.createEyewearDetails({
          brand: "Oakley",
        })

        const updated = await service.updateEyewearDetails({
          id: created.id,
          brand: "Oakley Updated",
          polarized: true,
        })

        expect(updated.brand).toEqual("Oakley Updated")
        expect(updated.polarized).toEqual(true)
      })

      it("deletes eyewear details", async () => {
        const created = await service.createEyewearDetails({
          brand: "Gucci",
        })

        await service.deleteEyewearDetails(created.id)

        await expect(
          service.retrieveEyewearDetails(created.id)
        ).rejects.toThrow()
      })

      it("defaults polarized to false when not provided", async () => {
        const created = await service.createEyewearDetails({
          brand: "Prada",
        })

        expect(created.polarized).toEqual(false)
      })
    })
  },
})
