import { type UseFormReturn } from "react-hook-form";
import { type ProfileValues } from "./formSchemas";
import { type UserPrivacySettings } from "@models/tables";

export type OnboardingOutletContext = {
  buttonClicked: boolean;
  setButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  goToNextStep: () => void;
  profileForm: UseFormReturn<ProfileValues>;
  privacySettings: UserPrivacySettings | null;
  setPrivacySettings: React.Dispatch<React.SetStateAction<UserPrivacySettings | null>>;
}