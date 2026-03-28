create or replace function handle_flashcard_bookmark()
returns trigger
language plpgsql
as $$
begin
  if (tg_op = 'INSERT') then
    update flashcard_sets
    set bookmarks = bookmarks + 1
    where id = new.flashcard_set_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update flashcard_sets
    set bookmarks = bookmarks - 1
    where id = old.flashcard_set_id;
    return old;
  end if;
  return null;
end;
$$;

create trigger flashcard_bookmark_trigger
after insert or delete on flashcard_bookmarks
for each row
execute function handle_flashcard_bookmark();