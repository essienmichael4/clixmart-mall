import { z } from "zod";

export const CategorySchema = z.object({
    name: z.string({
        message: "Must be a valid category name."
    })
})

export const EditCategorySchema = z.object({
    name: z.string().min(2, {
        message: "Must be a valid category name."
    }).optional().or(z.literal(''))
})

export const SubCategorySchema = z.object({
    name: z.string({
        message: "Must be a valid category name."
    }),
    category: z.string().min(2, {
        message: "Must be a valid sub category name."
    }),
})

export const EditSubCategorySchema = z.object({
    name: z.string().min(2, {
        message: "Must be a valid sub category name."
    }).optional().or(z.literal('')),
    category: z.string().min(2, {
        message: "Must be a valid sub category name."
    }).optional().or(z.literal(''))
})

export type CategorySchemaType = z.infer<typeof CategorySchema>
export type EditCategorySchemaType = z.infer<typeof EditCategorySchema>
export type SubCategorySchemaType = z.infer<typeof SubCategorySchema>
export type EditSubCategorySchemaType = z.infer<typeof EditSubCategorySchema>
