import type { Database } from "@models/supabase";

export type User = Database['public']['Tables']['users']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Theme = Database['public']['Tables']['themes']['Row'];
export type Achievement = Database['public']['Tables']['achievements']['Row'];
export type Statistics = Database['public']['Tables']['user_statistics']['Row'];
export type Course = Database['public']['Tables']['courses']['Row'];
export type StatisticsWithCourse = Omit<Statistics, 'course_id'> & {
  course: Course | null;
};
export type UserPrivacy = Database['public']['Tables']['user_privacy']['Row'];
export type UserPrivacySettings = Omit<UserPrivacy, 'user_id' | 'created_at'>;