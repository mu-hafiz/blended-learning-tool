import { type UseFormReturn } from "react-hook-form";
import { type ProfileValues } from "./formSchemas";

export type OnboardingOutletContext = {
  buttonClicked: boolean;
  setButtonClicked: React.Dispatch<React.SetStateAction<boolean>>;
  goToNextStep: () => void;
  profileForm: UseFormReturn<ProfileValues>;
}