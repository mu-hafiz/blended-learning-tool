import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Please enter an email"),
  password: z.string()
    .min(1, "Please enter a password"),
});

export type LoginValues = z.infer<typeof loginSchema>