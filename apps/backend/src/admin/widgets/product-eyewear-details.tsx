import { useEffect, useState } from "react"
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import type { DetailWidgetProps, AdminProduct } from "@medusajs/framework/types"
import {
  Button,
  Container,
  Heading,
  Input,
  Label,
  Select,
  Switch,
  Text,
  toast,
} from "@medusajs/ui"

type EyewearDetails = {
  id: string
  brand: string
  model_name: string | null
  gender: string | null
  frame_shape: string | null
  frame_material: string | null
  frame_color: string | null
  lens_color: string | null
  lens_type: string | null
  polarized: boolean
  lens_width: number | null
  bridge_width: number | null
  temple_length: number | null
}

type FormState = {
  brand: string
  model_name: string
  gender: string
  frame_shape: string
  frame_material: string
  frame_color: string
  lens_color: string
  lens_type: string
  polarized: boolean
  lens_width: string
  bridge_width: string
  temple_length: string
}

const GENDER_OPTIONS = [
  { value: "uomo", label: "Uomo" },
  { value: "donna", label: "Donna" },
  { value: "unisex", label: "Unisex" },
  { value: "bambino", label: "Bambino" },
]

const LENS_TYPE_OPTIONS = [
  { value: "vista", label: "Vista" },
  { value: "sole", label: "Sole" },
  { value: "neutra", label: "Neutra" },
  { value: "fotocromatica", label: "Fotocromatica" },
  { value: "polarizzata", label: "Polarizzata" },
  { value: "altro", label: "Altro" },
]

const EMPTY_FORM: FormState = {
  brand: "",
  model_name: "",
  gender: "",
  frame_shape: "",
  frame_material: "",
  frame_color: "",
  lens_color: "",
  lens_type: "",
  polarized: false,
  lens_width: "",
  bridge_width: "",
  temple_length: "",
}

const toFormState = (details: EyewearDetails | null): FormState => {
  if (!details) {
    return EMPTY_FORM
  }

  return {
    brand: details.brand ?? "",
    model_name: details.model_name ?? "",
    gender: details.gender ?? "",
    frame_shape: details.frame_shape ?? "",
    frame_material: details.frame_material ?? "",
    frame_color: details.frame_color ?? "",
    lens_color: details.lens_color ?? "",
    lens_type: details.lens_type ?? "",
    polarized: details.polarized ?? false,
    lens_width: details.lens_width?.toString() ?? "",
    bridge_width: details.bridge_width?.toString() ?? "",
    temple_length: details.temple_length?.toString() ?? "",
  }
}

const toNumberOrNull = (value: string): number | null => {
  if (value.trim() === "") {
    return null
  }
  const parsed = Number(value)
  return Number.isNaN(parsed) ? null : parsed
}

const ProductEyewearDetailsWidget = ({
  data: product,
}: DetailWidgetProps<AdminProduct>) => {
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchEyewearDetails = async () => {
      try {
        const response = await fetch(`/admin/products/${product.id}/eyewear`, {
          credentials: "include",
        })

        if (!response.ok) {
          throw new Error("Failed to load eyewear details")
        }

        const json = await response.json()

        if (isMounted) {
          setForm(toFormState(json.eyewear_details))
        }
      } catch (error) {
        if (isMounted) {
          toast.error("Dettagli occhiale", {
            description: "Impossibile caricare i dettagli occhiale.",
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchEyewearDetails()

    return () => {
      isMounted = false
    }
  }, [product.id])

  const updateField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    if (!form.brand.trim()) {
      toast.error("Dettagli occhiale", {
        description: "Il campo Brand è obbligatorio.",
      })
      return
    }

    setIsSaving(true)

    try {
      const response = await fetch(`/admin/products/${product.id}/eyewear`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          brand: form.brand.trim(),
          model_name: form.model_name.trim() || null,
          gender: form.gender || null,
          frame_shape: form.frame_shape.trim() || null,
          frame_material: form.frame_material.trim() || null,
          frame_color: form.frame_color.trim() || null,
          lens_color: form.lens_color.trim() || null,
          lens_type: form.lens_type || null,
          polarized: form.polarized,
          lens_width: toNumberOrNull(form.lens_width),
          bridge_width: toNumberOrNull(form.bridge_width),
          temple_length: toNumberOrNull(form.temple_length),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save eyewear details")
      }

      const json = await response.json()
      setForm(toFormState(json.eyewear_details))

      toast.success("Dettagli occhiale", {
        description: "Dettagli salvati con successo.",
      })
    } catch (error) {
      toast.error("Dettagli occhiale", {
        description: "Salvataggio non riuscito. Riprova.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Dettagli occhiale</Heading>
      </div>

      {isLoading ? (
        <div className="px-6 py-4">
          <Text size="small" className="text-ui-fg-subtle">
            Caricamento...
          </Text>
        </div>
      ) : (
        <div className="flex flex-col gap-y-4 px-6 py-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-4">
            <div className="flex flex-col gap-y-2">
              <Label size="small">Brand</Label>
              <Input
                value={form.brand}
                onChange={(e) => updateField("brand", e.target.value)}
                placeholder="Ray-Ban"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Modello</Label>
              <Input
                value={form.model_name}
                onChange={(e) => updateField("model_name", e.target.value)}
                placeholder="Aviator"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Genere</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => updateField("gender", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Seleziona genere" />
                </Select.Trigger>
                <Select.Content>
                  {GENDER_OPTIONS.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Forma montatura</Label>
              <Input
                value={form.frame_shape}
                onChange={(e) => updateField("frame_shape", e.target.value)}
                placeholder="Pilota"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Materiale montatura</Label>
              <Input
                value={form.frame_material}
                onChange={(e) => updateField("frame_material", e.target.value)}
                placeholder="Metallo"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Colore montatura</Label>
              <Input
                value={form.frame_color}
                onChange={(e) => updateField("frame_color", e.target.value)}
                placeholder="Oro"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Colore lente</Label>
              <Input
                value={form.lens_color}
                onChange={(e) => updateField("lens_color", e.target.value)}
                placeholder="Verde"
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Tipo lente</Label>
              <Select
                value={form.lens_type}
                onValueChange={(value) => updateField("lens_type", value)}
              >
                <Select.Trigger>
                  <Select.Value placeholder="Seleziona tipo lente" />
                </Select.Trigger>
                <Select.Content>
                  {LENS_TYPE_OPTIONS.map((option) => (
                    <Select.Item key={option.value} value={option.value}>
                      {option.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select>
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Calibro lente (mm)</Label>
              <Input
                type="number"
                value={form.lens_width}
                onChange={(e) => updateField("lens_width", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Ponte (mm)</Label>
              <Input
                type="number"
                value={form.bridge_width}
                onChange={(e) => updateField("bridge_width", e.target.value)}
              />
            </div>

            <div className="flex flex-col gap-y-2">
              <Label size="small">Lunghezza asta (mm)</Label>
              <Input
                type="number"
                value={form.temple_length}
                onChange={(e) => updateField("temple_length", e.target.value)}
              />
            </div>

            <div className="flex items-center gap-x-2 pt-6">
              <Switch
                id="polarized"
                checked={form.polarized}
                onCheckedChange={(checked) => updateField("polarized", checked)}
              />
              <Label htmlFor="polarized" size="small">
                Polarizzato
              </Label>
            </div>
          </div>

          <div className="flex justify-end">
            <Button
              variant="primary"
              size="small"
              onClick={handleSave}
              isLoading={isSaving}
            >
              Salva
            </Button>
          </div>
        </div>
      )}
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.after",
})

export default ProductEyewearDetailsWidget
