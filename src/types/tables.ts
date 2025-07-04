import type { Database } from "@models/supabase";

export type Profile = Database['public']['Tables']['profiles']['Row'];