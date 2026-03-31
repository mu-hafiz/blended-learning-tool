alter table "public"."achievements" add column "percentage" text not null default '0'::text;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.recalculate_achievement_percentages()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
declare
  user_count int;
  unlocked_count int;
  achievement record;
begin

  select count(*)
  into user_count
  from users;

  if user_count <= 0 then
    raise exception 'Number of users is zero, which should not happen';
  end if;

  for achievement in select id from achievements loop
    select count(*)
    into unlocked_count
    from unlocked_achievements
    where achievement_id = achievement.id;

    update achievements
    set percentage = ROUND((unlocked_count::numeric / user_count) * 100)
    where id = achievement.id;
  end loop;

  return new;

end;
$function$
;

CREATE TRIGGER achievement_percentage_trigger AFTER INSERT OR DELETE ON public.unlocked_achievements FOR EACH ROW EXECUTE FUNCTION public.recalculate_achievement_percentages();


