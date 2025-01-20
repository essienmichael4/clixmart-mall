import { z } from "zod";

export const PackageSchema = z.object({
    email: z.string().email({
        message: "Email must be a valid email."
    }).optional(),
    phone: z.string().min(9, {
        message: "Must be a valid phone number."
    }).optional().or(z.literal('')),
    trackingNumber: z.string({
        message: "Must be a valid tracking number."
    }),
    package: z.string({
        message: "Must be a valid package number."
    }).optional(),
    description: z.string().optional().or(z.literal('')),
    vessel: z.string().min(2, {
        message: "Must be a valid vessel name."
    }).optional().or(z.literal('')),
    customer: z.string().min(2, {
        message: "Must be a valid name."
    }),
    cbm: z.coerce.number().positive().min(0.001),
    quantity: z.coerce.number().positive().min(0),
    loaded: z.coerce.date(),
    received: z.coerce.date(),
    eta: z.coerce.date(),
    status:z.union([
        z.literal("ON_HOLD"),
        z.literal("EN_ROUTE"),
        z.literal("ARRIVED"),
        z.literal("DELIVERED")
    ])
})

export const EditPackageSchema = z.object({
    email: z.string().email({
        message: "Email must be a valid email."
    }).optional().or(z.literal('')),
    phone: z.string().min(9, {
        message: "Must be a valid phone number."
    }).optional().or(z.literal('')),
    trackingNumber: z.string({
        message: "Must be a valid tracking number."
    }).optional().or(z.literal('')),
    package: z.string({
        message: "Must be a valid package."
    }).optional().or(z.literal("")),
    description: z.string({
        message: "Must be a valid package desccription."
    }).optional().or(z.literal('')),
    vessel: z.string().min(2, {
        message: "Must be a valid vessel name."
    }).optional().or(z.literal('')),
    customer: z.string().min(2, {
        message: "Must be a valid name."
    }).optional().or(z.literal('')),
    cbm: z.coerce.number().positive().min(0.001).optional(),
    quantity: z.coerce.number().positive().min(0).optional(),
    loaded: z.coerce.date().optional(),
    received: z.coerce.date().optional(),
    eta: z.coerce.date().optional()
})

export const EditPackageLoadedSchema = z.object({
    loaded: z.coerce.date().optional(),
})

export const EditPackageReceivedSchema = z.object({
    received: z.coerce.date().optional(),
})

export const EditPackageEtaSchema = z.object({
    eta: z.coerce.date().optional(),
})

export type PackageSchemaType = z.infer<typeof PackageSchema>
export type EditPackageSchemaType = z.infer<typeof EditPackageSchema>
export type EditLoadedSchemaType = z.infer<typeof EditPackageLoadedSchema>
export type EditReceivedSchemaType = z.infer<typeof EditPackageReceivedSchema>
export type EditEtaSchemaType = z.infer<typeof EditPackageEtaSchema>
