import { z } from "zod";

export const CropSchema = z.object({
    code: z.string(),
    country: z.object({value: z.string(),label: z.string()}),
    collection: z.object({value: z.string(),label: z.string()}),
    size: z.object({value: z.string(),label: z.string()}),
    shape: z.object({value: z.string(),label: z.string()}),
    style: z.object({value: z.string(),label: z.string()}),
    color: z.object({value: z.string(),label: z.string()}),
    model: z.object({value: z.string(),label: z.string()}),
    factory: z.object({value: z.string(),label: z.string()}),
    isMetric:z.object({value: z.string(),label: z.string()})
});

export type CropFormType = z.infer<typeof CropSchema>;
