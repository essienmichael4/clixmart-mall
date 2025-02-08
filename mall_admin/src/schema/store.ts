import { z } from "zod";

export const EditStoreReviewSchema = z.object({
    status: z.string({
        message: "Status must be a valid status."
    }).optional().or(z.literal('')),
    // description: z.string().optional().or(z.literal("")),
})

export type EditStoreReviewSchemaType = z.infer<typeof EditStoreReviewSchema>
