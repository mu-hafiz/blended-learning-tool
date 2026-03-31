import { z } from "zod";

export const flashcardSetSchema = z.object({
  title: z.string()
    .min(1, "Please enter a title"),
  description: z.string().optional(),
  private: z.boolean(),
  flashcards: z.array(z.object({
    front: z.string()
      .min(1, "Front is required"),
    back: z.string()
      .min(1, "Back is required")
  })).min(1, "Add at least one flashcard"),
  tags: z.array(z.string())
    .max(5, "Maximum of 5 tags")
});

export type FlashcardSetValues = z.infer<typeof flashcardSetSchema>