import { z } from "zod";

export const AwardsSchema = z.object({
  title: z.string(),
  sum:z.number(),
});

export type AwardsFormType = z.infer<typeof AwardsSchema>;
