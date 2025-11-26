import { z } from "zod";

export const DepartmentSchema = z.object({
    name: z.string({
        message: "Must be a valid department name."
    }),
    description: z.string().optional().or(z.literal('')),
})

export type DepartmentSchemaType = z.infer<typeof DepartmentSchema>
