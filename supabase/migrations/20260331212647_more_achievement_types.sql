alter type "public"."achievement_type" rename to "achievement_type__old_version_to_be_dropped";

create type "public"."achievement_type" as enum ('flashcard_sets_completed', 'flashcard_sets_created', 'flashcards_used', 'flashcards_correct', 'friends_made', 'flashcard_set_repeats');

alter table "public"."achievements" alter column type type "public"."achievement_type" using type::text::"public"."achievement_type";

drop type "public"."achievement_type__old_version_to_be_dropped";

create or replace view "public"."flashcard_set_counts" as  SELECT user_id,
    flashcard_set_id,
    count(*) AS count
   FROM public.flashcard_history
  GROUP BY user_id, flashcard_set_id;



