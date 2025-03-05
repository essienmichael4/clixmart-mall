import { z } from "zod";

export const BrandSchema = z.object({
    name: z.string({
        message: "Must be a valid brand name."
    })
})

export const EditBrandSchema = z.object({
    name: z.string().min(2, {
        message: "Must be a valid brand name."
    }).optional().or(z.literal('')),
    category: z.string().min(2, {
        message: "Must be a valid sub category name."
    }).optional().or(z.literal('')),
})

export type BrandSchemaType = z.infer<typeof BrandSchema>
export type EditBrandSchemaType = z.infer<typeof EditBrandSchema>
