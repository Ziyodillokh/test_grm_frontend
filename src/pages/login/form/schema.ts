import { z } from "zod";

import { requiredStringField } from "@/utils/schemaHelper";

export const LoginSchema = z.object({
  login: requiredStringField(),
  password: z.string().optional(),
});

export type LoginFormType = z.infer<typeof LoginSchema>;
