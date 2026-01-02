import { useOutletContext } from "react-router-dom";
import { type AccountOutletContext } from "../types/stateTypes";

const AccountPrivacy = () => {

  const { privacySettings, setPrivacySettings } = useOutletContext<AccountOutletContext>();

  return (
    <div>
      <h2>Privacy Settings</h2>
      <p className="subtitle">Tailor your account privacy and visibility</p>
      <hr className="my-3"/>
      {privacySettings && (
        Object.entries(privacySettings).map(([key, value]) => {
          return (
            <p>{key}: {value}</p>
          )
        })
      )}
    </div>
  );
};

export default AccountPrivacy;