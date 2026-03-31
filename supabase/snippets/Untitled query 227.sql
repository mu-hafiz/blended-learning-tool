create or replace function update_flashcard_set(
  p_flashcard_set_id uuid,
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
begin

  if jsonb_array_length(p_flashcards) <= 0 then
    raise exception 'Must have at least one flashcard';
  end if;

  update flashcard_sets
  set
    title = p_title,
    description = p_description,
    private = p_private,
    num_of_flashcards = jsonb_array_length(p_flashcards),
    tags = p_tags
  where
    id = p_flashcard_set_id and
    creator_id = p_user_id;

  -- Delete existing flashcards and replace them
  delete from flashcards
  where flashcard_set_id = p_flashcard_set_id;

  insert into flashcards (flashcard_set_id, front, back, "order")
    select
      p_flashcard_set_id,
      card->>'front',
      card->>'back',
      row_number() over ()
    from jsonb_array_elements(p_flashcards) as card;

  return p_flashcard_set_id;
  
end;
$$;