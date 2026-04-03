alter table "public"."notifications" drop column "course_id";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.daily_check_in_reset()
 RETURNS void
 LANGUAGE plpgsql
AS $function$begin
  update user_statistics us
  set current_streak = 0
  from users u
  where us.user_id = u.user_id
    and u.daily_check_in = false;
  
  update users
  set daily_check_in = false
  where daily_check_in = true;
end;$function$
;


