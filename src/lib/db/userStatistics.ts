import { supabase } from "@lib/supabaseClient";
import PrivacyDB from "@lib/db/userPrivacy";

async function getStatistics(userId: string) {
  const { data, error } = await supabase.from('user_statistics')
    .select()
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Could not get user statistics: ', error);
    throw new Error('Could not get user statistics: ', error);
  }

  return data;
}

// Only used for leaderboards
async function getLeaderboardStatisticsAllUsers(userId: string) {
  const { data, error } = await supabase.from('user_statistics')
    .select(`*,
      user:user_id(
        *,
        user_privacy(*)
      )`
    );

  if (error) {
    console.error('Could not get user statistics: ', error);
    throw new Error('Could not get user statistics: ', error);
  }

  const settingsList = await PrivacyDB.getPrivacySettingsForAllUsers(userId);

  return data.filter(u => {
    const setting = settingsList.find(s => s.userId === u.user_id);
    if (!setting) return false;
    if (u.user_id === userId) return true;
    return setting.settings.leaderboards;
  });
}


export default { getStatistics, getLeaderboardStatisticsAllUsers };