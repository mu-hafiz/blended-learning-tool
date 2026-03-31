create or replace function create_flashcard_set(
  p_user_id uuid,
  p_title text,
  p_description text,
  p_private boolean,
  p_flashcards jsonb,
  p_tags text[]
)
returns uuid
language plpgsql
security definer
as $$
declare
  new_flashcard_set_id uuid;
begin

  if jsonb_array_length(p_flashcards) <= 0 then
    raise exception 'Must have at least one flashcard';
  end if;

  insert into flashcard_sets (creator_id, title, description, private, num_of_flashcards, tags)
  values (p_user_id, p_title, p_description, p_private, jsonb_array_length(p_flashcards), p_tags)
  returning id into new_flashcard_set_id;

  insert into flashcards (flashcard_set_id, front, back, "order")
    select
      new_flashcard_set_id,
      card->>'front',
      card->>'back',
      row_number() over ()
    from jsonb_array_elements(p_flashcards) as card;
  
  update user_statistics
  set flashcard_sets_created = flashcard_sets_created + 1
  where user_id = p_user_id;

  return new_flashcard_set_id;
  
end;
$$;