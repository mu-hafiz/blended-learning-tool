alter table "public"."notifications" add column "archived" boolean not null default false;

create or replace view "public"."flashcard_sets_last_used" as  SELECT DISTINCT ON (flashcard_set_id) flashcard_set_id,
    user_id,
    created_at
   FROM public.flashcard_history
  ORDER BY flashcard_set_id, created_at DESC;



