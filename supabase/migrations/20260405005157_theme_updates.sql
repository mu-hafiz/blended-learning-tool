alter type "public"."unlock_type" rename to "unlock_type__old_version_to_be_dropped";

create type "public"."unlock_type" as enum ('flashcard_sets_completed', 'flashcard_sets_created', 'flashcards_used', 'flashcards_correct', 'friends_made', 'flashcard_set_repeats', 'likes_given', 'account_created', 'best_streak', 'days_studied');

alter table "public"."achievements" alter column unlock_type type "public"."unlock_type" using unlock_type::text::"public"."unlock_type";

alter table "public"."themes" alter column unlock_type type "public"."unlock_type" using unlock_type::text::"public"."unlock_type";

drop type "public"."unlock_type__old_version_to_be_dropped";

alter table "public"."unlocked_themes" add column "used" boolean not null default false;


  create policy "Users can add their own unlocked themes"
  on "public"."unlocked_themes"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update their unlocked themes"
  on "public"."unlocked_themes"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



