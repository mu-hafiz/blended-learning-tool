import { supabase } from "@lib/supabaseClient";

async function getFlashcardComments(flashcardSetId: string) {
  const { data, error } = await supabase.from('flashcard_comments')
    .select(`*,
      user:users!flashcard_comments_user_id_fkey(*),
      reply_to_user:users!flashcard_comments_reply_to_user_id_fkey(*)`
    )
    .eq('flashcard_set_id', flashcardSetId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Could not get flashcard sets: ', error);
    throw new Error('Could not get flashcard sets: ', error);''
  }

  return data;
}

async function createFlashcardComment(
  userId: string,
  flashcardSetId: string,
  comment: string,
  parentId: string | null,
  replyToUserId: string | null,
) {
  const { data, error } = await supabase.from('flashcard_comments')
    .insert({
      user_id: userId,
      flashcard_set_id: flashcardSetId,
      comment: comment,
      parent_id: parentId,
      reply_to_user_id: replyToUserId
    })
    .select(`*,
      user:users!flashcard_comments_user_id_fkey(*),
      reply_to_user:users!flashcard_comments_reply_to_user_id_fkey(*)`)
    .single();
  
  if (error) {
    console.error('Could not create flashcard comment: ', error);
    throw new Error('Could not create flashcard comment: ', error);
  }

  return data;
};

async function deleteFlashcardComment(commentId: string) {
  const { error } = await supabase.from('flashcard_comments')
    .update({ deleted: true })
    .eq('id', commentId);

  if (error) {
    console.error('Could not delete flashcard comment: ', error);
    throw new Error('Could not delete flashcard comment: ', error);
  }
}

export default {
  getFlashcardComments,
  createFlashcardComment,
  deleteFlashcardComment
};