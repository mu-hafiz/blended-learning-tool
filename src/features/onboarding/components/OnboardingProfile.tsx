import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { type OnboardingOutletContext } from "../types/stateTypes";
import { RHFTextInput } from "@components";
import UserDB from "@lib/db/users";
import { tryCatch } from "@utils/tryCatch";
import { toast } from "@lib/toast";

const OnboardingProfile = () => {
  const { buttonClicked, setButtonClicked, goToNextStep, profileForm } = useOutletContext<OnboardingOutletContext>();

  useEffect(() => {
    if (!buttonClicked) return;

    const validateForm = async () => {
      const formIsValid = await profileForm.trigger();
      if (!formIsValid) return;

      // Check username
      const { data: usernameNotTaken, error } = await tryCatch(UserDB.checkUsername(profileForm.getValues().username));
      if (error) {
        toast.error("Could not check username, please try again later");
        return;
      }

      if (!usernameNotTaken) {
        profileForm.setError("username", {
          type: "manual",
          message: "This username is already taken"
        });
        return;
      }

      goToNextStep();
    }

    validateForm();
    setButtonClicked(false);
  }, [buttonClicked]);

  return (
    <form className="flex flex-col gap-1">
      <RHFTextInput
        name="username"
        control={profileForm.control}
        description="Maximum 30 characters"
        placeholder="MyCoolUsername"
        title="Username"
      />
      <RHFTextInput
        name="firstName"
        control={profileForm.control}
        title="First Name"
        placeholder="John"
      />
      <RHFTextInput
        name="middleName"
        control={profileForm.control}
        title="Middle Name"
        required={false}
      />
      <RHFTextInput
        name="lastName"
        control={profileForm.control}
        title="Last Name"
        placeholder="Doe"
      />
      <RHFTextInput
        name="aboutMe"
        control={profileForm.control}
        title="About Me"
        description="Write down anything about yourself that you want others to know about!"
        multiline
        required={false}
      />
    </form>
  );
};

export default OnboardingProfile;