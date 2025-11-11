import { supabase } from "@lib/supabaseClient";

async function getUserUnlockedThemes(userId: string) {
  const { data, error } = await supabase.from('unlocked_themes')
    .select('theme_id(*)')
    .eq('user_id', userId);
  
  if (error) {
    console.log("Error getting user's unlocked themes: ", error);
    throw new Error("Error getting user's unlocked themes: ", error);
  }

  return data;
}

export default { getUserUnlockedThemes };