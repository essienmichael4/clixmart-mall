import { z } from "zod";

export const ProductSchema = z.object({
    name: z.string().min(2, {
        message: "Must be a valid product name."
    }),
})

export const ProductDetailsSchema = z.object({
    model: z.string().min(2, {
        message: "Model must be a valid product model."
    }).optional().or(z.literal('')),
    brand: z.string().min(2, {
        message: "Brand must be a valid brand."
    }).optional().or(z.literal('')),
    category: z.string({
        message: "Must be a valid catagory."
    }).optional().or(z.literal('')),
    subCategory: z.string({
        message: "Must be a valid sub category."
    }).optional().or(z.literal('')),
    description: z.string({
        message: "Must be a valid package."
    }).optional().or(z.literal("")),
    inventry: z.string({
        message: "Must be a valid inventory status."
    }).optional().or(z.literal('')),
    quantity: z.coerce.number().positive().min(0).optional(),
    price: z.coerce.number().positive().min(0).optional(),
    discount: z.coerce.number().positive().min(0.00).optional(),
})

// export const EditPackageLoadedSchema = z.object({
//     loaded: z.coerce.date().optional(),
// })

// export const EditPackageReceivedSchema = z.object({
//     received: z.coerce.date().optional(),
// })

// export const EditPackageEtaSchema = z.object({
//     eta: z.coerce.date().optional(),
// })

export type ProductSchemaType = z.infer<typeof ProductSchema>
export type ProductDetailsSchemaType = z.infer<typeof ProductDetailsSchema>
// export type EditLoadedSchemaType = z.infer<typeof EditPackageLoadedSchema>
// export type EditReceivedSchemaType = z.infer<typeof EditPackageReceivedSchema>
// export type EditEtaSchemaType = z.infer<typeof EditPackageEtaSchema>
