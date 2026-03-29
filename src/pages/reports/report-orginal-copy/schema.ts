import { z } from "zod";

export const ReportSchema = z.object({
  title: z.string(),
  price: z.number(),
  kv: z.number(),
});

export type ReportFormType = z.infer<typeof ReportSchema>;
