import { supabase } from "@lib/supabaseClient";

async function getAchievements() {
  const { data, error } = await supabase.from('achievements').select();

  if (error) {
    console.error('Could not get achievements: ', error);
    throw new Error('Could not get achievements: ', error);
  }

  return data;
};

export default { getAchievements };