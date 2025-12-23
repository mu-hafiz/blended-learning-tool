import type { Database } from "./supabase";

export type NotificationType = Database['public']['Enums']['notification_type'];
export type AchievementType = Database['public']['Enums']['achievement_type'];
export type PrivacyType = Database['public']['Enums']['privacy_type'];
export type PrivacyNeededType = Database['public']['Enums']['privacy_needed_type'];