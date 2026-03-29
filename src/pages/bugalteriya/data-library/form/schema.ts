import { z } from "zod";

import { requiredStringField } from "@/utils/schemaHelper";

export const CropSchema = z.object({
  title: requiredStringField(),
  collection: z
    .object({ value: z.string().optional(), label: z.string().optional() })
    .optional(),
  country: z
    .object({ value: z.string().optional(), label: z.string().optional() })
    .optional(),
    factory: z
    .object({ value: z.string().optional(), label: z.string().optional() })
    .optional(),
});

export type CropFormType = z.infer<typeof CropSchema>;
