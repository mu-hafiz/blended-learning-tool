create or replace function check_unlocks()
returns trigger
language plpgsql
as $$
begin

  -- Handle achievement unlocks
  perform supabase_functions.http_request(
    'https://puniest-domingo-roentgenopaque.ngrok-free.dev/functions/v1/check-achievements',
    'POST',
    json_build_object(
      'Content-Type', 'application/json',
      'x-trigger-secret', current_setting('achievement_trigger.secret')
    )::text,
    json_build_object(
      'updated_table', tg_table_name,
      'new_row', row_to_json(new)
    )::text,
    '3000'
  );

  -- Handle theme unlocks

end;
$$;

create trigger check_unlocks_trigger
after insert or update on user_statistics
for each row
execute function check_unlocks();