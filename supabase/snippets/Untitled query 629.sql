DROP VIEW flashcard_sets_last_used;

CREATE VIEW flashcard_sets_last_used AS
SELECT DISTINCT ON (user_id, flashcard_set_id)
  flashcard_set_id, 
  user_id, 
  created_at
FROM flashcard_history
ORDER BY user_id, flashcard_set_id, created_at DESC;