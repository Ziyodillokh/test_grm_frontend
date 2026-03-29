import * as z from "zod";

export const requiredStringField = (msg?: string) =>
  z
    .string()
    .trim()
    .min(1, msg || "This field is required");

export const requiredEmailField = requiredStringField(
  "Please enter your email address"
).email("Please enter valid email");

export const requiredPasswordField = requiredStringField(
  "Please enter your password"
)
  .min(
    6,
    "At least 6 characters long and include at least one uppercase letter, one lowercase letter, one number"
  )
  .refine(
    (value) => /^[a-zA-Z0-9#!@$%^&*_]*$/.test(value),
    "Use only these special characters: #, !, @, $, %, ^, &, *., _"
  )
  .refine(
    (value) => value.trim() === value,
    "Password cannot contain leading or trailing spaces."
  )
  .refine((value) => !/\s/.test(value), "Password cannot contain spaces.")
  .refine(
    (value) => /[A-Z]/.test(value),
    "Password must include at least one uppercase letter."
  )
  .refine(
    (value) => /[a-z]/.test(value),
    "Password must include at least one lowercase letter."
  )
  .refine(
    (value) => /\d/.test(value),
    "Password must include at least one number."
  );

export const DeleteSchema = z.object({ id: z.string() });
