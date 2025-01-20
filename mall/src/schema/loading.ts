import { z } from "zod";

export const AddLoadingSchema = z.object({
    vessel: z.string().min(2, {
        message: "This must be a vessel name."
    }),
    loaded: z.coerce.date().optional(),
    eta: z.coerce.date().optional(),
    status:z.union([
        z.literal("IN_TRANSIT"),
        z.literal("ARRIVED"),
        z.literal("DELIVERED")
    ])
})

export const EditLoadingSchema = z.object({
    vessel: z.string().min(2, {
        message: "Title must be a proper title."
    }).optional().or(z.literal('')),
    loaded: z.coerce.date().optional(),
    eta: z.coerce.date().optional(),
    status:z.union([
        z.literal("IN_TRANSIT"),
        z.literal("ARRIVED"),
        z.literal("DELIVERED")
    ])
})

export type AddLoadingSchemaType = z.infer<typeof AddLoadingSchema>
export type EditLoadingSchemaType = z.infer<typeof EditLoadingSchema>

