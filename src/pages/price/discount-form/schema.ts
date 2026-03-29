import { z } from "zod";

export const DiscountSchema = z.object({
  title: z.string(),
  discountPercentage: z.number(),
  isAdd: z.boolean().optional(),
});


export type DiscountFormType = z.infer<typeof DiscountSchema>;
