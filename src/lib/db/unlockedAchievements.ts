import { supabase } from "@lib/supabaseClient";

async function getUnlockedAchievements(userId: string) {
  const { data, error } = await supabase.from('unlocked_achievements')
    .select('achievement_id(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Could not get user achievements: ', error);
    throw new Error('Could not get user achievements: ', error);
  }

  return data.map(achievements => achievements.achievement_id);
};

export default { getUnlockedAchievements };