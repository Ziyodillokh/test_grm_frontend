import { z } from "zod";

const SelectTypeField = z.object({
  value: z.string().optional(),
  label: z.string().optional(),
});

export const PartiyaSchema = z.object({
  country: SelectTypeField,
  factory: SelectTypeField,
  partiya_no: SelectTypeField,
  warehouse: SelectTypeField,
  user: SelectTypeField,
  expense: z.number(),
  date: z.date(),
  volume: z.number(),
});

//     volume,
export type PartiyaFormType = z.infer<typeof PartiyaSchema>;
