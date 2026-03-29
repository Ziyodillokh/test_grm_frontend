import { requiredStringField } from "@/utils/schemaHelper";
import { z } from "zod";

export const ProductsCheckSchema = z.object({
  name: requiredStringField(),
  description: z.string(),
});

export type ProductsCheckFormType = z.infer<typeof ProductsCheckSchema>;
