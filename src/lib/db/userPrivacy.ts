import { supabase } from "@lib/supabaseClient";

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

export default { getPrivacySettings }