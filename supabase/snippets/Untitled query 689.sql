create or replace function daily_check_in()
returns trigger
language plpgsql
security definer
as $$
begin
  if (select daily_check_in from users where user_id = p_user_id) = false then

    update user_statistics
    set
      current_streak = current_streak + 1,
      days_studied = days_studied + 1,
      best_streak = greatest(best_streak, current_streak + 1)
    where user_id = p_user_id;

    perform add_to_user_xp(p_user_id, 100);
  end if;

  update users
  set daily_check_in = true
  where user_id = p_user_id;
end;
$$;