import { useEffect, useState } from 'react';
import UserPrivacyDB from '@lib/db/userPrivacy';
import { useAuth } from "@providers/AuthProvider";
import type { UserPrivacy } from "@models/tables";

type PrivacySettings = Omit<UserPrivacy, 'user_id'|'created_at'>

const AccountPrivacy = () => {
  const { user } = useAuth();
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);

  useEffect(() => {
    if (!user) return;

    const getPrivacySettings = async () => {
      const data = await UserPrivacyDB.getPrivacySettings(user.id);
      const { user_id, created_at, ...privacyData } = data;
      setPrivacySettings(privacyData);
    }

    getPrivacySettings();
  }, [user]);

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