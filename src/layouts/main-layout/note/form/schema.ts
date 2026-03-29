import { z } from "zod";

export const DataSchema = z.object({
    color: z.string(),
    title: z.string(),
  
});

export type FormDataType = z.infer<typeof DataSchema>;
