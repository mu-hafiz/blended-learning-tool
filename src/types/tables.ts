import type { Database } from "@models/supabase";

export type User = Database['public']['Tables']['users']['Row'];
export type Notification = Database['public']['Tables']['notifications']['Row'];
export type Theme = Database['public']['Tables']['themes']['Row'];