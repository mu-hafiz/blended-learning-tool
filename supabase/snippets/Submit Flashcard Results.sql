create or replace function submit_flashcard_results(
  p_user_id uuid,
  p_flashcard_set_id uuid,
  p_total_cards int,
  p_correct_cards int
)
returns int
language plpgsql
security definer
as $$
declare
  v_xp int := 0;
  v_xp_threshold int := 20;
begin

  -- Calculate XP
  if p_total_cards <= v_xp_threshold then
    v_xp = p_correct_cards;
  else
    v_xp = floor(v_xp_threshold * (p_correct_cards / p_total_cards));
  end if;

  -- Add XP
  perform add_to_user_xp(p_user_id, v_xp);

  -- Store History
  insert into flashcard_history (user_id, flashcard_set_id, total_cards, correct_cards, xp_earned)
  values (p_user_id, p_flashcard_set_id, p_total_cards, p_correct_cards, v_xp);

  -- Update statistics
  update user_statistics
  set
    flashcard_sets_completed = flashcard_sets_completed + 1,
    flashcards_used = flashcards_used + p_total_cards,
    flashcards_correct = flashcards_correct + p_correct_cards
  where user_id = p_user_id;

  return v_xp;
end;
$$;