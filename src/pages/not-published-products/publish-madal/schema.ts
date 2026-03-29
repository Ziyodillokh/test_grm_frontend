import { z } from "zod";

export const QrBaseSchema = z.object({
  imgUrl:  z
  .object({
    id: z.string().optional(),
    url: z.string().optional(),
  })
  .optional(),
  internetInfo:z.string(),
  country: z.object({value: z.string(),label: z.string()}),
  collection: z.object({value: z.string(),label: z.string()}),
  size: z.object({value: z.string(),label: z.string()}),
  shape: z.object({value: z.string(),label: z.string()}),
  style: z.object({value: z.string(),label: z.string()}),
  color: z.object({value: z.string(),label: z.string()}),
  model: z.object({value: z.string(),label: z.string()}),
  factory:z.object({value: z.string().optional(),label: z.string().optional(),}).optional(),
  i_price: z.number(),
  code:z.string(),
  status:z.string(),
  sizeType:z.object({value: z.string(),label: z.string()}),
});

export type QrBaseFormType = z.infer<typeof QrBaseSchema>;
