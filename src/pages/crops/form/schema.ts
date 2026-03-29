import { z } from "zod";

import { requiredStringField } from "@/utils/schemaHelper";
export const CropSchema = z.object({
  name: requiredStringField(),
  description: z.string(),
  // details: requiredStringField(),
  harvest_duration: z.number(),
  biology_name: requiredStringField(),
  crop_code: requiredStringField(),
  // variety: requiredStringField(),
  is_common: z.boolean(),
  crop_category: z.string(),
  main_image: z
    .object({
      id: z.number(),
      aws_path: z.string(),
    })
    .optional(),
  planting_time_start: z.date(),
  planting_time_end: z.date(),
});

export type CropFormType = z.infer<typeof CropSchema>;
