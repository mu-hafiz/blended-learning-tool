create or replace function prevent_onboarding_undo()
returns trigger
language plpgsql
security definer
as $$
begin
  if old.onboarding_completed = true and new.onboarding_completed = false then
    raise exception 'Cannot set onboarding_completed to false after being set to true (cannot undo onboarding)';
  end if;
  return new;
end;
$$;

drop trigger if exists prevent_onboarding_undo_trigger on users;

create trigger prevent_onboarding_undo_trigger
before update on users
for each row
execute function prevent_onboarding_undo();