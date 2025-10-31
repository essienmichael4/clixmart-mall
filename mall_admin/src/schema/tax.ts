import { z } from "zod";

export const TaxSchema = z.object({
    taxPercent: z.coerce.number().positive().min(0).max(100),
})

export const EditTaxSchema = z.object({
    taxPercent: z.coerce.number().positive().min(0).max(100),
})

export type TaxSchemaType = z.infer<typeof TaxSchema>
export type EditTaxSchemaType = z.infer<typeof EditTaxSchema>
