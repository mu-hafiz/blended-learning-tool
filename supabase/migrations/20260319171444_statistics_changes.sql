alter table "public"."user_statistics" drop constraint "user_statistics_course_id_fkey";

alter table "public"."user_statistics" drop constraint "user_statistics_pkey";

drop index if exists "public"."user_course_unique";

drop index if exists "public"."user_misc_stats_unique";

drop index if exists "public"."user_statistics_pkey";

alter table "public"."user_statistics" drop column "course_id";

alter table "public"."user_statistics" drop column "id";

CREATE UNIQUE INDEX user_statistics_pkey ON public.user_statistics USING btree (user_id);

alter table "public"."user_statistics" add constraint "user_statistics_pkey" PRIMARY KEY using index "user_statistics_pkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  insert into public.users(user_id, theme_id)
  select new.id, t.id
  from public.themes t
  where t.title = 'Dark Brand';

  insert into public.user_statistics (user_id)
  values (new.id);

  insert into public.user_privacy(user_id)
  values (new.id);

  insert into public.unlocked_themes(user_id, theme_id)
  select new.id, t.id
  from public.themes t
  where t.title in ('Light Brand', 'Dark Brand');

  return new;
end;$function$
;


