set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.daily_check_in(p_user_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$declare
  new_streak int;
begin
  if (select daily_check_in from users where user_id = p_user_id) = false then
    -- Update current streak
    update user_statistics
    set
      current_streak = current_streak + 1,
      days_studied = days_studied + 1
    where user_id = p_user_id
    returning current_streak into new_streak;

    -- Update best streak
    if new_streak > (select best_streak from user_statistics where user_id = p_user_id) then
      update user_statistics
      set best_streak = new_streak
      where user_id = p_user_id;
    end if;

    -- Add XP
    perform add_to_user_xp(p_user_id, 100);
  end if;

  -- Check in
  update users
  set daily_check_in = true
  where user_id = p_user_id;
end;$function$
;


