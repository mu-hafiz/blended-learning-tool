import { supabase } from "@lib/supabaseClient";
import type { UserPrivacySettings } from "@models/tables";

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

export default { getPrivacySettings, setPrivacySettings }