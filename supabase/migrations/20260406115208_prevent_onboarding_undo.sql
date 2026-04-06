set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.prevent_onboarding_undo()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  if old.onboarding_completed = true and new.onboarding_completed = false then
    raise exception 'Cannot set onboarding_completed to false after being set to true (cannot undo onboarding)';
  end if;
  return new;
end;
$function$
;

CREATE TRIGGER prevent_onboarding_undo_trigger BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.prevent_onboarding_undo();


