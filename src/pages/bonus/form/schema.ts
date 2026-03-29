import { z } from "zod";

export const BonusSchema = z.object({
  title: z.string(),
  condition:z.number(),
  conditionUnit:z.string(),
  operator:z.string(),
  bonusAmount:z.number(),
  bonusUnit:z.string(),
  endDate:z.date(),
});


export type BonusFormType = z.infer<typeof BonusSchema>;
