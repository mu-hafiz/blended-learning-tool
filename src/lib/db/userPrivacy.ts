import { supabase } from "@lib/supabaseClient";
import type { UserPrivacySettings } from "@models/tables";
import FriendsDB from "./friends";

async function getPrivacySettings(userId: string) {
  const { data, error } = await supabase.from('user_privacy')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Could not get user statistics: ', error);
    throw new Error('Could not get user statistics: ', error);
  }

  return data;
}

// Returns whether to display content for each category
async function getPrivacySettingsForUser(userId: string, secondaryId: string) {
  const { data, error: settingsError } = await supabase.from('user_privacy')
    .select()
    .eq('user_id', secondaryId)
    .single();
  
  if (settingsError) {
    console.error('Could not get user statistics: ', settingsError);
    throw new Error('Could not get user statistics: ', settingsError);
  }

  const { user_id, created_at, ...settings } = data;

  const friendStatus = await FriendsDB.checkFriendStatus(userId, secondaryId);
  
  type SettingKeys = keyof typeof settings;
  const booleanSettings: Record<SettingKeys, boolean> = {} as Record<SettingKeys, boolean>;

  for (const key of Object.keys(settings) as SettingKeys[]) {
    const value = settings[key];
    switch (value) {
      case "public":
        booleanSettings[key] = true;
        break;
      case "friends_only":
        booleanSettings[key] = friendStatus === "friends";
        break;
      case "private":
        booleanSettings[key] = false;
        break;
    }
  }

  return booleanSettings;
}

async function setPrivacySettings(userId: string, settings: UserPrivacySettings) {
  const { error } = await supabase.from('user_privacy')
    .update(settings)
    .eq('user_id', userId)

  if (error) {
    console.error('Could not get user statistics: ', error);
    throw new Error('Could not get user statistics: ', error);
  }

  return true;
}

export default { getPrivacySettings, getPrivacySettingsForUser, setPrivacySettings }