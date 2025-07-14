import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string()
    .min(1, "Please enter an email")
    .regex(/^[^\s@]+@(student\.)?manchester\.ac\.uk$/, { message: "Please enter a valid University of Manchester email" }),
  password: z.string()
    .min(1, "Please enter a password")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/, "Your password must pass all requirements")
});

export type SignUpValues = z.infer<typeof signUpSchema>