import { z } from "zod";

export const loginSchema = z.object({
  email: z.string()
    .min(1, "Please enter an email")
    .regex(/^[^\s@]+@(student\.)?manchester\.ac\.uk$/, { message: "Please enter a valid University of Manchester email" }),
  password: z.string()
    .min(1, "Please enter a password"),
});

export const signUpSchema = z.object({
  email: z.string()
    .min(1, "Please enter an email")
    .regex(/^[^\s@]+@(student\.)?manchester\.ac\.uk$/, { message: "Please enter a valid University of Manchester email" }),
  password: z.string()
    .min(1, "Please enter a password")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/, "Your password must pass all requirements")
});

export const securitySchema = z.object({
  newPassword: z.string().min(1, "Please enter your new password")
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/, "Your password must pass all requirements"),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
  oldPassword: z.string().min(1, "Please enter your old password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"]
}).refine((data) => data.newPassword !== data.oldPassword, {
  message: "Your new and old passwords cannot match.",
  path: ["newPassword"]
});

export const profileSchema = z.object({
  username: z.string()
    .min(6, "Must be at least 6 characters long")
    .max(30, "Cannot be more than 30 characters long"),
  firstName: z.string().min(1, "Please provide your first name"),
  middleName: z.string(),
  lastName: z.string().min(1, "Please provide your last name"),
  aboutMe: z.string()
});

export type LoginValues = z.infer<typeof loginSchema>
export type SignUpValues = z.infer<typeof signUpSchema>
export type SecurityValues = z.infer<typeof securitySchema>
export type ProfileValues = z.infer<typeof profileSchema>