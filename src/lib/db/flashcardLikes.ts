import { supabase } from "@lib/supabaseClient";

async function getLikedFlashcardSets(userId: string) {
  const { data, error } = await supabase.from('flashcard_likes')
    .select()
    .eq('user_id', userId);
  
  if (error) {
    console.error('Could not get like flashcard sets: ', error);
    throw new Error('Could not get like flashcard sets: ', error);
  }

  return data.map(l => l.flashcard_set_id);
}

async function likeFlashcardSet(userId: string, flashcardSetId: string) {
  const { error } = await supabase.from('flashcard_likes')
    .insert({
      user_id: userId,
      flashcard_set_id: flashcardSetId
    });
  
  if (error) {
    console.error('Could not like flashcard sets: ', error);
    throw new Error('Could not like flashcard sets: ', error);
  }
}

async function unlikeFlashcardSet(userId: string, flashcardSetId: string) {
  const { error } = await supabase.from('flashcard_likes')
    .delete()
    .eq('user_id', userId)
    .eq('flashcard_set_id', flashcardSetId);
  
  if (error) {
    console.error('Could not like flashcard sets: ', error);
    throw new Error('Could not like flashcard sets: ', error);
  }
}

export default {
  getLikedFlashcardSets,
  likeFlashcardSet,
  unlikeFlashcardSet
}