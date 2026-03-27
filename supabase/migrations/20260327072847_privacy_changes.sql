alter table "public"."user_privacy" alter column "friends" drop default;

alter table "public"."user_privacy" alter column friends type "public"."privacy_type" using friends::text::"public"."privacy_type";

alter table "public"."user_privacy" alter column "friends" set default 'public'::public.privacy_type;

alter table "public"."user_privacy" drop column "profile";

alter table "public"."user_privacy" add column "profile_picture" public.privacy_needed_type not null default 'public'::public.privacy_needed_type;

alter table "public"."user_privacy" add column "statistics" public.privacy_needed_type not null default 'public'::public.privacy_needed_type;

alter table "public"."user_privacy" alter column "achievements" drop default;

alter table "public"."user_privacy" alter column "achievements" set data type public.privacy_needed_type using "achievements"::text::public.privacy_needed_type;

alter table "public"."user_privacy" alter column "achievements" set default 'public'::public.privacy_needed_type;

alter table "public"."user_privacy" alter column "friends" set default 'friends_only'::public.privacy_type;


