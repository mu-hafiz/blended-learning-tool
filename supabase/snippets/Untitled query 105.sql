create or replace function handle_flashcard_like()
returns trigger
language plpgsql
security definer
as $$
begin
  if (tg_op = 'INSERT') then
    update flashcard_sets
    set likes = likes + 1
    where id = new.flashcard_set_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update flashcard_sets
    set likes = likes - 1
    where id = old.flashcard_set_id;
    return old;
  end if;
  return null;
end;
$$;

drop trigger if exists flashcard_like_trigger on flashcard_likes;

create trigger flashcard_like_trigger
after insert or delete on flashcard_likes
for each row
execute function handle_flashcard_like();