create or replace function recalculate_achievement_percentages()
returns trigger
language plpgsql
security definer
as $$
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
$$;

drop trigger if exists achievement_percentage_trigger on unlocked_achievements;

create trigger achievement_percentage_trigger
after insert or delete on unlocked_achievements
for each row
execute function recalculate_achievement_percentages();