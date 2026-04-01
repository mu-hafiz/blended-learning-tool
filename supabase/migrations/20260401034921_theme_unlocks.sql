create type "public"."unlock_type" as enum ('flashcard_sets_completed', 'flashcard_sets_created', 'flashcards_used', 'flashcards_correct', 'friends_made', 'flashcard_set_repeats', 'likes_given');

alter type "public"."notification_type" rename to "notification_type__old_version_to_be_dropped";

create type "public"."notification_type" as enum ('friend_request_received', 'friend_request_accepted', 'like_received', 'achievement_unlocked', 'level_up', 'theme_unlocked');

alter table "public"."notifications" alter column type type "public"."notification_type" using type::text::"public"."notification_type";

drop type "public"."notification_type__old_version_to_be_dropped";

alter table "public"."achievements" drop column "type";

alter table "public"."achievements" add column "unlock_type" public.unlock_type not null;

alter table "public"."themes" add column "description" text not null;

alter table "public"."themes" add column "unlock_type" public.unlock_type not null;

alter table "public"."themes" alter column "unlock_criteria" set not null;

alter table "public"."themes" alter column "unlock_criteria" set data type jsonb using "unlock_criteria"::jsonb;

drop type "public"."achievement_type";


