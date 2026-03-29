import { z } from "zod";

export const ClientSchema = z.object({
  fullName: z.string(),
  // comment:z.string().optional(),
  phone: z.string(),
  given:z.number().optional(),
  owed:z.number().optional(),
});

export type ClientFormType = z.infer<typeof ClientSchema>;
