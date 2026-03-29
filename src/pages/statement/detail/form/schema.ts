import { z } from "zod";

export const PayrollItemSchema = z.object({
  plastic: z.number(),
  in_hand: z.number(),
  prepayment: z.number(),
  userId: z.string().optional(),
  awardId: z.string().optional(),
  bonusId: z.string().optional(),
  salary:z.number().optional(),
  is_premium: z.boolean(),
  is_bonus: z.boolean(),
  selectedMonth:z.number().optional(),
  payrollId:z.string().optional(),
});



export type PayrollItemFormType = z.infer<typeof PayrollItemSchema>;