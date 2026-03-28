import { supabase } from "@lib/supabaseClient";

async function getAllPublicFlashcardSets(userId: string) {
  const { data, error } = await supabase.from('flashcard_sets')
    .select('*, creator:creator_id(*)')
    .or(`private.eq.false,creator_id.eq.${userId}`);

  if (error) {
    console.error('Could not get flashcard sets: ', error);
    throw new Error('Could not get flashcard sets: ', error);
  }

  return data;
}

export default {
  getAllPublicFlashcardSets
};