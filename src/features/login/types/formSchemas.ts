import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Please enter an email")
    .regex(/^[^\s@]+@(student\.)?manchester\.ac\.uk$/, { message: "Please enter a valid University of Manchester email" }),
  password: z.string()
    .min(1, "Please enter a password"),
});

export type LoginValues = z.infer<typeof loginSchema>