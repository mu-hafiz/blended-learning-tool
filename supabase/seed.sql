INSERT INTO "public"."achievements" ("id", "title", "unlock_criteria", "created_at", "type", "description", "image_url", "xp") VALUES
	('f588de1d-b0a9-471e-bfdf-cc21dca4a02d', 'Flashcard Beginner', '{"completed": 1}', '2025-11-09 16:58:15.763175+00', 'flashcard_sets_completed', 'Use your first flashcard set', NULL, 50),
	('a05e581b-b004-4ff9-bd34-6d4fd9e5635c', 'Flashcard Maker', '{"created": 1}', '2025-11-09 16:58:42.199438+00', 'flashcard_sets_created', 'Create your first flashcard set', NULL, 50),
	('76ca1647-5858-4987-9cb5-8e0dd2a58efe', 'Flashcard Novice', '{"completed": 5}', '2025-11-09 17:15:59.221625+00', 'flashcard_sets_completed', 'Use flashcard sets 5 times', NULL, 50);

INSERT INTO "public"."themes" ("id", "title", "unlock_criteria", "created_at", "data_theme", "type") VALUES
	('21c860db-843c-44af-bc49-d7bca48d8f99', 'Light Brand', 'Unlock by creating an account', '2025-11-01 00:01:52.082499+00', 'light-brand', 'light'),
	('cbf14722-49cd-471b-9ff3-20e31c92e2bb', 'Dark Brand', 'Unlock by creating an account', '2025-11-01 00:02:07.809943+00', 'dark-brand', 'dark');