create or replace view "public"."flashcard_sets_last_used" as  SELECT DISTINCT ON (user_id, flashcard_set_id) flashcard_set_id,
    user_id,
    created_at
   FROM public.flashcard_history
  ORDER BY user_id, flashcard_set_id, created_at DESC;



