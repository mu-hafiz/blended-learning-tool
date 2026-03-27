import { supabase } from "@lib/supabaseClient";

async function getUnlockedAchievements(userId: string) {
  const { data, error } = await supabase.from('unlocked_achievements')
    .select('created_at, achievement_id(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.error('Could not get user achievements: ', error);
    throw new Error('Could not get user achievements: ', error);
  }

  return data.map(achievement => {
    const { created_at, achievement_id } = achievement;
    return {
      ...achievement_id,
      created_at
    }
  });
};

export default { getUnlockedAchievements };