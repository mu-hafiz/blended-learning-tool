import { supabase } from "@lib/supabaseClient";

async function getFlashcardHistory(userId: string, flashcardSetId: string) {
  const { data, error } = await supabase.from('flashcard_history')
    .select()
    .eq('user_id', userId)
    .eq('flashcard_set_id', flashcardSetId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Could not get flashcard sets: ', error);
    throw new Error('Could not get flashcard sets: ', error);''
  }

  return data;
}

export default {
  getFlashcardHistory
};