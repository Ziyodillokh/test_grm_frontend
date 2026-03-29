import { z } from "zod";

export const FilialSchema = z.object({
  title: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  fatherName: z.string(),
  login: z.string(),
  address: z.string(),
  phone1: z.string(),
  type: z.string().optional(),
});

export type FilialFormType = z.infer<typeof FilialSchema>;
