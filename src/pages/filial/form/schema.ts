import { z } from "zod";

export const FilialSchema = z.object({
  title: z.string(),
  name: z.string(),
  telegram: z.string(),
  address: z.string(),
  addressLink: z.string(),
  landmark: z.string(),
  phone1: z.string(),
  type: z.string().optional(),
  endWorkTime:z.string(),
  startWorkTime:z.string(),
});

export type FilialFormType = z.infer<typeof FilialSchema>;
