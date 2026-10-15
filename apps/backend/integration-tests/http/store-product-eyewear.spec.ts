import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { Modules } from "@medusajs/framework/utils"
import type { IProductModuleService } from "@medusajs/framework/types"
import upsertEyewearDetailsWorkflow from "../../src/workflows/upsert-eyewear-details"

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    describe("GET /store/products/:id/eyewear", () => {
      let publishableApiKey: string
      let productWithEyewearId: string
      let productWithoutEyewearId: string

      beforeAll(async () => {
        const container = getContainer()
        const productModuleService: IProductModuleService = container.resolve(
          Modules.PRODUCT
        )
        const apiKeyModuleService = container.resolve(Modules.API_KEY)

        const [productWithEyewear, productWithoutEyewear] =
          await productModuleService.createProducts([
            {
              title: "Test Eyewear Product",
              status: "published",
            },
            {
              title: "Test Product Without Eyewear",
              status: "published",
            },
          ])

        productWithEyewearId = productWithEyewear.id
        productWithoutEyewearId = productWithoutEyewear.id

        await upsertEyewearDetailsWorkflow(container).run({
          input: {
            product_id: productWithEyewearId,
            data: {
              brand: "Ray-Ban",
              model_name: "RB2140",
              gender: "unisex",
              frame_shape: "Wayfarer",
              frame_material: "Acetato",
              frame_color: "Nero",
              lens_color: "Verde",
              lens_type: "sole",
              polarized: false,
              lens_width: 50,
              bridge_width: 22,
              temple_length: 150,
            },
          },
        })

        const apiKey = await apiKeyModuleService.createApiKeys({
          title: "Test publishable key",
          type: "publishable",
          created_by: "test",
        })

        publishableApiKey = apiKey.token
      })

      afterAll(async () => {
        const container = getContainer()
        const productModuleService: IProductModuleService = container.resolve(
          Modules.PRODUCT
        )
        const apiKeyModuleService = container.resolve(Modules.API_KEY)

        await productModuleService.deleteProducts([
          productWithEyewearId,
          productWithoutEyewearId,
        ])
        await apiKeyModuleService.deleteApiKeys([publishableApiKey]).catch(
          () => undefined
        )
      })

      it("returns eyewear details for a product that has them", async () => {
        const response = await api
          .get(`/store/products/${productWithEyewearId}/eyewear`, {
            headers: { "x-publishable-api-key": publishableApiKey },
          })
          .catch((e) => e.response)

        expect(response.status).toEqual(200)
        expect(response.data.eyewear).toEqual({
          brand: "Ray-Ban",
          model_name: "RB2140",
          gender: "unisex",
          frame_shape: "Wayfarer",
          frame_material: "Acetato",
          frame_color: "Nero",
          lens_color: "Verde",
          lens_type: "sole",
          polarized: false,
          lens_width: 50,
          bridge_width: 22,
          temple_length: 150,
        })
      })

      it("returns eyewear: null for a product without eyewear details", async () => {
        const response = await api
          .get(`/store/products/${productWithoutEyewearId}/eyewear`, {
            headers: { "x-publishable-api-key": publishableApiKey },
          })
          .catch((e) => e.response)

        expect(response.status).toEqual(200)
        expect(response.data.eyewear).toBeNull()
      })

      it("returns 404 for a non-existent product", async () => {
        const response = await api
          .get(`/store/products/prod_does_not_exist/eyewear`, {
            headers: { "x-publishable-api-key": publishableApiKey },
          })
          .catch((e) => e.response)

        expect(response.status).toEqual(404)
      })

      it("rejects requests without a publishable API key", async () => {
        const response = await api
          .get(`/store/products/${productWithEyewearId}/eyewear`)
          .catch((e) => e.response)

        expect(response.status).toEqual(400)
      })
    })
  },
})
