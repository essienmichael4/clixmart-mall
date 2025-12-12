import { z } from "zod";
import { optionalNumber } from "./location";

export const CarrierSchema = z.object({
    accountId: z.number().nonnegative(),
    hubId: optionalNumber(z.number().nonnegative()),
    // region: optionalNumber(z.number().nonnegative()),
    // mmda: optionalNumber(z.number().nonnegative()),
})

export const HubTypeSchema = z.object({
    name: z.string({
        message: "Must be a valid Hub type name."
    }),
    description: z.string().optional().or(z.literal('')),
})

export type CarrierSchemaType = z.infer<typeof CarrierSchema>
export type HubTypeSchemaType = z.infer<typeof HubTypeSchema>
