alter type "public"."unlock_type" rename to "unlock_type__old_version_to_be_dropped";

create type "public"."unlock_type" as enum ('flashcard_sets_completed', 'flashcard_sets_created', 'flashcards_used', 'flashcards_correct', 'friends_made', 'flashcard_set_repeats', 'likes_given', 'account_created');

alter table "public"."achievements" alter column unlock_type type "public"."unlock_type" using unlock_type::text::"public"."unlock_type";

alter table "public"."themes" alter column unlock_type type "public"."unlock_type" using unlock_type::text::"public"."unlock_type";

drop type "public"."unlock_type__old_version_to_be_dropped";


