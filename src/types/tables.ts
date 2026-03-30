import type { Database } from "@models/supabase";

export type User = Database['public']['Tables']['users']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Theme = Database['public']['Tables']['themes']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type Statistics = Database['public']['Tables']['user_statistics']['Row'];
export type StatisticsWithUser = Statistics & {
  user: User
};
export type UserPrivacy = Database['public']['Tables']['user_privacy']['Row'];
export type UserPrivacySettings = Omit<UserPrivacy, 'user_id' | 'created_at'>;
export type UserPrivacyBoolean = {
  [K in keyof UserPrivacySettings]: boolean;
};
export type Friend = {
  friend: User;
  date: string;
}
export type FlashcardSet = Database['public']['Tables']['flashcard_sets']['Row'];
export type FlashcardSetWithUser = FlashcardSet & {
  creator: User
};
export type Flashcard = Database['public']['Tables']['flashcards']['Row'];
export type FlashcardSetWithFlashcards = FlashcardSet & {
  flashcards: Flashcard[]
}