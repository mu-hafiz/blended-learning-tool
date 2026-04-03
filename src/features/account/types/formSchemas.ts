import { z } from "zod";

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
    .min(4, "Username can't be less than 4 characters")
    .max(30, "Username can't be more than 30 characters")
    .regex(/^[a-zA-Z0-9_.]+$/, "Only letters, numbers, and underscores allowed"),
  firstName: z.string()
    .min(1, "Please enter your first name")
    .max(50, "First name can't be more than 50 characters")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([\- '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "Names can only have letters, hyphens, apostrophes and spaces"),
  middleName: z
    .string()
    .max(50, "Middle name can't be more than 50 characters")
    .optional()
    .refine(
      (val) => !val || /^[A-Za-zÀ-ÖØ-öø-ÿ]+([\- '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(val),
      { message: "Names can only have letters, hyphens, apostrophes and spaces" }
    ),
  lastName: z.string()
    .min(1, "Please enter your last name")
    .max(50, "Last name can't be more than 50 characters")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([\- '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "Names can only have letters, hyphens, apostrophes and spaces"),
  aboutMe: z.string().optional()
})

export type SecurityValues = z.infer<typeof securitySchema>
export type ProfileValues = z.infer<typeof profileSchema>