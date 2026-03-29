import { z } from "zod";

export const ClientSchema = z.object({
  fullName: z.string(),
  comment:z.string().optional(),
  filialId:z.string(),
  phone: z.string(),
  userId:z.string(),
});

export type ClientFormType = z.infer<typeof ClientSchema>;
