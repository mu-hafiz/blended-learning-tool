import { supabase } from "@lib/supabaseClient";

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

// NEED TO IMPLEMENT FOR LEADERBOARD
async function getStatisticsAllUsers() {
  const { data, error } = await supabase.from('user_statistics')
    .select('*, user:user_id(*)');

  if (error) {
    console.error('Could not get user statistics: ', error);
    throw new Error('Could not get user statistics: ', error);
  }

  return data;
}


export default { getStatistics, getStatisticsAllUsers };