import { type UseFormReturn } from "react-hook-form";
import type { ProfileValues, SecurityValues } from "./formSchemas";
import { type User } from "@supabase/supabase-js";
import type { UserPrivacySettings } from "@models/tables";

export type AccountOutletContext = {
  privacySettings: UserPrivacySettings | null;
  setPrivacySettings: React.Dispatch<React.SetStateAction<UserPrivacySettings | null>>;
  privacyEdited: boolean;
  handlePrivacySubmit: () => void;
  privacySubmitting: boolean;
  profileForm: UseFormReturn<ProfileValues>;
  securityForm: UseFormReturn<SecurityValues>;
  user: User | null | undefined;
}