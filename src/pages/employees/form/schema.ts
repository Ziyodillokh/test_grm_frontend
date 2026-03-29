import { z } from "zod";

export const UserSchema = z.object({
  firstName: z.string(),
  avatar: z.object({
    id: z.string().optional(),
    path: z.string().optional(),
  }).optional(),
  lastName: z.string(),
  fatherName: z.string(),
  hired: z.date(),
  position: z.object({
    value: z.string(),
    label: z.string(),
  }),
  filial:z.object({
    value: z.string(),
    label: z.string(),
  }),
  from: z.string(),
  to: z.string().optional(),
  phone: z.string(),
  login: z.string(),
  salary: z.number(),
});

export type UserFormType = z.infer<typeof UserSchema>;
