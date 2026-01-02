import { supabase } from "@lib/supabaseClient";

async function getFeatureFlag(flag: string) {
  const { data, error } = await supabase.from('feature_flags')
    .select()
    .eq('flag', flag)
    .single();

  if (error) {
    console.error('Could not get flag: ', error);
    throw new Error('Could not get flag: ', error);
  }

  return data.active;
};

export default { getFeatureFlag };