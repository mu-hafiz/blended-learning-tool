import { z } from "zod";

export const profileSchema = z.object({
  username: z.string()
    .min(1, "Please enter a nickname")
    .max(30, "Nickname can't be more than 30 characters"),
  firstName: z.string()
    .min(1, "Please enter your first name")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([\- '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "Names can only have letters, hyphens, apostrophes and spaces"),
  middleName: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^[A-Za-zÀ-ÖØ-öø-ÿ]+([\- '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/.test(val),
      { message: "Names can only have letters, hyphens, apostrophes and spaces" }
    ),
  lastName: z.string()
    .min(1, "Please enter your last name")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ]+([\- '][A-Za-zÀ-ÖØ-öø-ÿ]+)*$/, "Names can only have letters, hyphens, apostrophes and spaces"),
  aboutMe: z.string().optional()
})

export type ProfileValues = z.infer<typeof profileSchema>