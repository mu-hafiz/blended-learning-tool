import { supabase } from "@lib/supabaseClient";

async function getAllPublicFlashcardSets(userId: string) {
  const { data, error } = await supabase.from('flashcard_sets')
    .select('*, creator:creator_id(*)')
    .or(`private.eq.false,creator_id.eq.${userId}`);

  if (error) {
    console.error('Could not get flashcard sets: ', error);
    throw new Error('Could not get flashcard sets: ', error);''
  }

  return data;
}

async function getLatestPublicFlashcardSets(userId: string) {
  const { data, error } = await supabase.from('flashcard_sets')
    .select('*, creator:creator_id(*)')
    .or(`private.eq.false,creator_id.eq.${userId}`)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Could not get flashcard sets: ', error);
    throw new Error('Could not get flashcard sets: ', error);''
  }

  return data;
}

async function getLastUsedFlashcardSets(userId: string) {
  const { data, error } = await supabase.from('flashcard_sets_last_used')
    .select('flashcard_sets (*, creator:creator_id(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(3);

  if (error) {
    console.error('Could not get flashcard sets: ', error);
    throw new Error('Could not get flashcard sets: ', error);''
  }

  return data.map(item => item.flashcard_sets).filter(s => s !== null);
}

async function getFlashcardSetWithFlashcards(flashcardSetId: string) {
  const { data, error } = await supabase.from('flashcard_sets')
    .select('*, creator:creator_id(*), flashcards (*)')
    .eq('id', flashcardSetId)
    .order('order', { referencedTable: 'flashcards', ascending: true })
    .single();

  if (error) {
    console.error('Could not get flashcard sets: ', error);
    throw new Error('Could not get flashcard sets: ', error);
  }

  return data;
}

export default {
  getAllPublicFlashcardSets,
  getLatestPublicFlashcardSets,
  getLastUsedFlashcardSets,
  getFlashcardSetWithFlashcards
};