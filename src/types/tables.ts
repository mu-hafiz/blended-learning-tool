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
export type UserWithPrivacy = {
  user: User & {
    user_privacy: UserPrivacy | null;
  }
}
export type StatisticsWithUserAndPrivacy = Statistics & UserWithPrivacy
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
  creator: User,
  flashcards: Flashcard[]
}
export type FlashcardHistory = Database['public']['Tables']['flashcard_history']['Row'];
export type FlashcardComment = Database['public']['Tables']['flashcard_comments']['Row'];
export type FlashcardCommentWithUser = FlashcardComment & {
  user: User,
  reply_to_user: User | null
}