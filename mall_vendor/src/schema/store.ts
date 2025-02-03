import { z } from "zod";

export const StoreSchema = z.object({
    name: z.string({
        message: "Must be a valid name."
    })
})

export const StoreDetailSchema = z.object({
    nationalId: z.string({
        message: "Must be a valid tracking number."
    }),
    isRegistered: z.union([
        z.literal("TRUE"),
        z.literal("FALSE")
    ])
})

export const StoreAddressSchema = z.object({
    country: z.string({
        message: "Must be a valid country."
    }),
    state: z.string({
        message: "Must be a valid state."
    }).optional().or(z.literal('')),
    city: z.string({
        message: "Must be a valid city."
    }).optional().or(z.literal('')),
    addressLine: z.string({
        message: "Must be a valid street address."
    }),
    landmark: z.string({
        message: "Must be a valid landmark."
    }),
    phone: z.string({
        message: "Must be a valid phone."
    }),
    fullname: z.string({
        message: "Must be a valid name."
    }),
    zip: z.string({
        message: "Must be a valid zip code."
    }).optional().or(z.literal('')),
})

export const StorePaymentInfoSchema = z.object({
    paymentMode: z.string({
        message: "Must be a valid payment mode."
    }),
    accountNumber: z.string({
        message: "Must be a valid account number."
    }),
    accountName: z.string({
        message: "Must be a valid account name."
    }),
    provider: z.string({
        message: "Must be a valid institution name."
    })
})

export const NextOfKinInfoSchema = z.object({
    name: z.string({
        message: "Must be a valid name."
    }),
    phone: z.string({
        message: "Must be a valid phone number."
    })
})

export type StoreSchemaType = z.infer<typeof StoreSchema>
export type StoreDetailSchemaType = z.infer<typeof StoreDetailSchema>
export type StoreAddressSchemaType = z.infer<typeof StoreAddressSchema>
export type StorePaymentInfoSchemaType = z.infer<typeof StorePaymentInfoSchema>
export type NextOfKinInfoSchemaType = z.infer<typeof NextOfKinInfoSchema>
