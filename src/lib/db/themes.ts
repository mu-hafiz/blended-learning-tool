import { supabase } from "@lib/supabaseClient";

async function getThemes() {
  const { data, error } = await supabase.from('themes').select();
  
  if (error) {
    console.log("Error getting all themes: ", error);
    throw new Error("Error getting all themes: ", error);
  }
  
  return data;
};

export default { getThemes };