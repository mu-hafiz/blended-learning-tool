import { type UseFormReturn } from "react-hook-form";
import type { ProfileValues, SecurityValues } from "./formSchemas";
import type { UserPrivacy } from "@models/tables";
import { type User } from "@supabase/supabase-js";

export type PrivacySettings = Omit<UserPrivacy, 'user_id'|'created_at'>

export type AccountOutletContext = {
  privacySettings: PrivacySettings | null;
  setPrivacySettings: React.Dispatch<React.SetStateAction<PrivacySettings | null>>;
  profileForm: UseFormReturn<ProfileValues>;
  securityForm: UseFormReturn<SecurityValues>;
  user: User | null | undefined;
}