import { createClient } from 'npm:@supabase/supabase-js@2'

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

const getUserStats = async (user_id: string) => {
  const { data, error } = await supabaseAdmin.from('user_statistics')
    .select()
    .eq('user_id', user_id)
    .single();

  if (error) throw new Error(error.message || JSON.stringify(error));
  return data;
}

export const checkQuizCompletions = async (user_id: string, unlock_criteria: { completed: number }, perfect: boolean = false) => {
  const data = await getUserStats(user_id);
  const completed = perfect ? data.quizzes_perfected : data.quizzes_completed;
  if (completed >= unlock_criteria.completed) { return true }
  else { return false };
}

export const checkFlashcardCompletions = async (user_id: string, unlock_criteria: { completed: number }) => {
  const data = await getUserStats(user_id);
  if (data.flashcards_completed >= unlock_criteria.completed) { return true }
  else { return false };
}

export const checkQuizCreations = async (user_id: string, unlock_criteria: { created: number }) => {
  const data = await getUserStats(user_id);
  if (data.quizzes_created >= unlock_criteria.created) { return true }
  else { return false };
}

export const checkFlashcardCreations = async (user_id: string, unlock_criteria: { created: number }) => {
  const data = await getUserStats(user_id);
  if (data.flashcards_created >= unlock_criteria.created) { return true }
  else { return false };
}