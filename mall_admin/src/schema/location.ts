import { z } from "zod";

export const optionalNumber = <T extends z.ZodNumber>(schema: T) =>
  z.preprocess(
    (val) => {
      if (val === "" || val === null || val === undefined) return undefined;

      if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed === "") return undefined;
        const num = Number(trimmed);
        return isNaN(num) ? undefined : num;
      }

      if (typeof val === "number") {
        return isNaN(val) ? undefined : val;
      }

      return undefined;
    },
    schema.optional()
);

export const RegionSchema = z.object({
    name: z.string({
        message: "Must be a valid Region name."
    }),
    capital: z.string().optional().or(z.literal('')),
    code: z.string().optional().or(z.literal('')),
})

export const MmdaSchema = z.object({
    name: z.string({
        message: "Must be a valid Region name."
    }),
    capital: z.string().optional().or(z.literal('')),
    type: z.union([
        z.literal("METROPOLITAN"),
        z.literal("MUNICIPAL"),
        z.literal("DISTRICT")
    ]),
    code: z.string().optional().or(z.literal('')),
    region: z.string().optional().or(z.literal('')),
})

export const TownSchema = z.object({
    name: z.string({
        message: "Must be a valid Region name."
    }),
    landmark: z.string().optional().or(z.literal('')),
    postcode: z.string().optional().or(z.literal('')),
    mmda: optionalNumber(z.number().nonnegative()),
})

export type RegionSchemaType = z.infer<typeof RegionSchema>
export type MmdaSchemaType = z.infer<typeof MmdaSchema>
export type TownSchemaType = z.infer<typeof TownSchema>
