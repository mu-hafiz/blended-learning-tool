import { useOutletContext } from "react-router-dom";
import { type AccountOutletContext } from "../types/stateTypes";
import { Button, Dropdown } from "@components";
import type { UserPrivacySettings } from "@models/tables";
import { snakeCaseToWords, wordsToSnakeCase } from "@utils/stringManip";

const options = {
  achievements: ["Public", "Friends Only"],
  friends: ["Public", "Friends Only", "Private"],
  leaderboards: ["Public", "Friends Only"],
  level: ["Public", "Friends Only"],
  name: ["Public", "Friends Only", "Private"],
  statistics: ["Public", "Friends Only"]
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
        <ul className="grid lg:grid-cols-2 gap-4 lg:gap-x-20 mb-5 mx-15 md:mx-30 lg:mx-20">
          {(Object.entries(privacySettings) as [keyof UserPrivacySettings, string][]).map(
            ([key, value]) => (
              <li key={key} className="grid grid-cols-3 items-center gap-30 sm:gap-20">
                <h3 className="capitalize">{snakeCaseToWords(key)}</h3>
                <Dropdown
                  options={options[key]}
                  onChange={(chosenValue) => handlePrivacyChange(key, chosenValue)}
                  value={snakeCaseToWords(value)}
                  disabled={privacySubmitting}
                  containerClassName="col-span-2"
                />
              </li>
          ))}
        </ul>
      )}
      <div className="flex justify-center">
        <Button
          disabled={!privacyEdited || privacySubmitting}
          onClick={handlePrivacySubmit}
        >
          Set Options
        </Button>
      </div>
      
    </>
  );
};

export default AccountPrivacy;