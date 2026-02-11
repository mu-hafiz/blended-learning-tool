import { useOutletContext } from "react-router-dom";
import { type AccountOutletContext } from "../types/stateTypes";
import { Button, Dropdown } from "@components";
import type { UserPrivacySettings } from "@models/tables";
import { snakeCaseToWords, wordsToSnakeCase } from "@utils/stringManip";

const options = {
  achievements: ["Public", "Friends Only", "Private"],
  friends: ["Public", "Friends Only", "Private"],
  leaderboards: ["Public", "Friends Only"],
  level: ["Public", "Friends Only"],
  name: ["Public", "Friends Only", "Private"],
  profile: ["Public", "Friends Only"]
}

const AccountPrivacy = () => {

  const { privacySettings, setPrivacySettings, privacyEdited, handlePrivacySubmit, privacySubmitting } = useOutletContext<AccountOutletContext>();

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
    <>
      <h2>Privacy Settings</h2>
      <p className="subtitle">Tailor your account privacy and visibility</p>
      <hr className="divider"/>
      {privacySettings && (
        (Object.entries(privacySettings) as [keyof UserPrivacySettings, string][]).map(
          ([key, value]) => (
          <div className="grid grid-cols-8" key={key}>
            <p className="capitalize">{key}</p>
            <Dropdown
              options={options[key]}
              onChange={(chosenValue) => handlePrivacyChange(key, chosenValue)}
              value={snakeCaseToWords(value)}
              disabled={privacySubmitting}
            />
          </div>
        ))
      )}
      <Button
        disabled={!privacyEdited || privacySubmitting}
        onClick={handlePrivacySubmit}
      >
        Set Options
      </Button>
    </>
  );
};

export default AccountPrivacy;