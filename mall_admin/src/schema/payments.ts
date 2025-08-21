import { z } from "zod";

export const PaymentSchema = z.object({
    store: z.string().min(2, {
        message: "Must be a valid name."
    }),
    amount: z.coerce.number().positive(),
})

export const EditPaymentSchema = z.object({
    store: z.string().min(2, {
        message: "Must be a valid name."
    }),
    amount: z.coerce.number().positive(),
})

export type PaymentSchemaType = z.infer<typeof PaymentSchema>
export type EditPaymentSchemaType = z.infer<typeof EditPaymentSchema>
