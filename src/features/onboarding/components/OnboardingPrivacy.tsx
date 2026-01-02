import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { type OnboardingOutletContext } from "../types/stateTypes";

const OnboardingPrivacy = () => {
  const { buttonClicked, setButtonClicked, goToNextStep } = useOutletContext<OnboardingOutletContext>();

  useEffect(() => {
    if (!buttonClicked) return;
    setButtonClicked(false);
    goToNextStep();
  }, [buttonClicked]);

  return (
    <div>
      <p>Onboarding Privacy</p>
    </div>
  );
};

export default OnboardingPrivacy;