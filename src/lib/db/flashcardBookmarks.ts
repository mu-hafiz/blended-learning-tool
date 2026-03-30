import { supabase } from "@lib/supabaseClient";

async function getBookmarkedFlashcardSets(userId: string) {
  const { data, error } = await supabase.from('flashcard_bookmarks')
    .select()
    .eq('user_id', userId);
  
  if (error) {
    console.error('Could not get bookmarked flashcard sets: ', error);
    throw new Error('Could not get bookmarked flashcard sets: ', error);
  }

  return data.map(b => b.flashcard_set_id);
}

async function isFlashcardSetBookmarked(userId: string, flashcardSetId: string) {
  const { data, error } = await supabase.from('flashcard_bookmarks')
    .select()
    .eq('user_id', userId)
    .eq('flashcard_set_id', flashcardSetId)
    .maybeSingle();
  
  if (error) {
    console.error('Could not get bookmarked flashcard sets: ', error);
    throw new Error('Could not get bookmarked flashcard sets: ', error);
  }

  return data !== null;
}

async function bookmarkFlashcardSet(userId: string, flashcardSetId: string) {
  const { error } = await supabase.from('flashcard_bookmarks')
    .insert({
      user_id: userId,
      flashcard_set_id: flashcardSetId
    });
  
  if (error) {
    console.error('Could not like flashcard sets: ', error);
    throw new Error('Could not like flashcard sets: ', error);
  }
}

async function removeBookmarkFlashcardSet(userId: string, flashcardSetId: string) {
  const { error } = await supabase.from('flashcard_bookmarks')
    .delete()
    .eq('user_id', userId)
    .eq('flashcard_set_id', flashcardSetId);
  
  if (error) {
    console.error('Could not like flashcard sets: ', error);
    throw new Error('Could not like flashcard sets: ', error);
  }
}

export default {
  getBookmarkedFlashcardSets,
  isFlashcardSetBookmarked,
  bookmarkFlashcardSet,
  removeBookmarkFlashcardSet
}