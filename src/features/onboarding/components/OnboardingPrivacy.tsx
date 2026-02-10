import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import type { OnboardingOutletContext } from "../types/stateTypes";
import type { UserPrivacySettings } from "@models/tables";
import { Dropdown } from "@components";
import { snakeCaseToWords, wordsToSnakeCase } from "@utils/stringManip";

const options = {
  achievements: ["Public", "Friends Only", "Private"],
  friends: ["Public", "Friends Only", "Private"],
  leaderboards: ["Public", "Friends Only"],
  level: ["Public", "Friends Only"],
  name: ["Public", "Friends Only", "Private"],
  profile: ["Public", "Friends Only"]
}

const OnboardingPrivacy = () => {
  const { buttonClicked, setButtonClicked, goToNextStep, privacySettings, setPrivacySettings } = useOutletContext<OnboardingOutletContext>();

  useEffect(() => {
    if (!buttonClicked) return;
    setButtonClicked(false);
    goToNextStep();
  }, [buttonClicked]);

  const handlePrivacyChange = (key: string, value: string) => {
    const snakeCase = wordsToSnakeCase(value);
    console.log(`Snake Case: ${snakeCase}`)
    setPrivacySettings(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        [key]: snakeCase,
      }
    })
  }

  return (
    <div>
      <h2>Privacy Settings</h2>
      <p className="subtitle">Tailor your account privacy and visibility</p>
      <hr className="my-3"/>
      <div className="grid grid-cols-4 items-center">
        {privacySettings && (
          (Object.entries(privacySettings) as [keyof UserPrivacySettings, string][]).map(
            ([key, value]) => (
            <>
              <p className="capitalize col-start-2" key={key}>{key}</p>
              <Dropdown
                options={options[key]}
                onChange={(chosenValue) => handlePrivacyChange(key, chosenValue)}
                value={snakeCaseToWords(value)}
              />
            </>
          ))
        )}
      </div>
    </div>
  );
};

export default OnboardingPrivacy;