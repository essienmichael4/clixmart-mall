import { z } from "zod";
import { optionalNumber } from "./location";

export const HubSchema = z.object({
    name: z.string({
        message: "Must be a valid Hub name."
    }),
    town: optionalNumber(z.number().nonnegative()),
    region: optionalNumber(z.number().nonnegative()),
    mmda: optionalNumber(z.number().nonnegative()),
})

export const HubTypeSchema = z.object({
    name: z.string({
        message: "Must be a valid Hub type name."
    }),
    description: z.string().optional().or(z.literal('')),
})

export type HubSchemaType = z.infer<typeof HubSchema>
export type HubTypeSchemaType = z.infer<typeof HubTypeSchema>
