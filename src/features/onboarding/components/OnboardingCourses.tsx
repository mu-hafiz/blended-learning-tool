import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { type OnboardingOutletContext } from "../types/stateTypes";

const OnboardingCourses = () => {
  const { buttonClicked, setButtonClicked, goToNextStep } = useOutletContext<OnboardingOutletContext>();

  useEffect(() => {
    if (!buttonClicked) return;
    setButtonClicked(false);
    goToNextStep();
  }, [buttonClicked]);

  return (
    <div>
      <p>Select your courses (IMPLEMENT!!)</p>
    </div>
  );
};

export default OnboardingCourses;