CREATE VIEW flashcard_set_counts AS
SELECT
  user_id,
  flashcard_set_id,
  COUNT(*) AS count
FROM flashcard_history
GROUP BY user_id, flashcard_set_id;