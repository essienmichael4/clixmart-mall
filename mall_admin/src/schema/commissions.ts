import { z } from "zod";

export const CommissionSchema = z.object({
    category: z.string({
        message: "Must be a valid category name."
    }),
    rate: z.coerce.number().positive().min(0).max(100).optional(),
})

export const EditCommissionSchema = z.object({
    rate: z.coerce.number().positive().min(0).max(100).optional(),
})

export type CommissionSchemaType = z.infer<typeof CommissionSchema>
export type EditCommissionSchemaType = z.infer<typeof EditCommissionSchema>
