import { type User } from "@models/tables";
import type { User as SupabaseUser } from "@supabase/supabase-js";

export type Friend = {
  friend: User;
  date: string;
}

export type Incoming = {
  sender: User;
  ignored: boolean;
}

export type FriendsOutletContext = {
  friendsList: Friend[];
  incomingRequests: Incoming[];
  outgoingRequests: User[];
  user: SupabaseUser | null | undefined,
  combinedUserIds: string[];
  ignoredUsers: User[];
}