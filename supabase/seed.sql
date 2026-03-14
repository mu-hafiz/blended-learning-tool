INSERT INTO "public"."achievements" ("id", "title", "unlock_criteria", "created_at", "type", "description", "image_url", "xp") VALUES
	('4bfacda1-208b-4e1b-be96-794a4f6ebb3d', 'Quiz Maker', '{"created": 1}', '2025-11-09 16:57:32.058125+00', 'quizzes_created', 'Create your first quiz', NULL, 50),
	('f588de1d-b0a9-471e-bfdf-cc21dca4a02d', 'Flashcard Beginner', '{"completed": 1}', '2025-11-09 16:58:15.763175+00', 'flashcard_sets_completed', 'Use your first flashcard set', NULL, 50),
	('a05e581b-b004-4ff9-bd34-6d4fd9e5635c', 'Flashcard Maker', '{"created": 1}', '2025-11-09 16:58:42.199438+00', 'flashcard_sets_created', 'Create your first flashcard set', NULL, 50),
	('a6550e70-99c6-4f8f-8803-232fe42b7c3c', 'Flawless Beginner', '{"completed": 1}', '2025-11-09 16:47:37.4569+00', 'quizzes_perfected', 'Get 100% on a quiz (minimum 10 questions)', NULL, 50),
	('76ca1647-5858-4987-9cb5-8e0dd2a58efe', 'Flashcard Novice', '{"completed": 5}', '2025-11-09 17:15:59.221625+00', 'flashcard_sets_completed', 'Use flashcard sets 5 times', NULL, 50),
	('781e5fbf-755c-49e4-a9be-7f9294190092', 'Quiz Beginner', '{"completed": 1}', '2025-11-09 09:13:28.536452+00', 'quizzes_completed', 'Complete your first quiz', NULL, 500),
	('8a94c5c2-ee47-413c-88b2-9e909fed435d', 'Quiz Novice', '{"completed": 5}', '2025-11-09 17:14:55.487205+00', 'quizzes_completed', 'Complete 5 quizzes', NULL, 500);

INSERT INTO "public"."themes" ("id", "title", "unlock_criteria", "created_at", "data_theme", "type") VALUES
	('21c860db-843c-44af-bc49-d7bca48d8f99', 'Light Brand', 'Unlock by creating an account', '2025-11-01 00:01:52.082499+00', 'light-brand', 'light'),
	('cbf14722-49cd-471b-9ff3-20e31c92e2bb', 'Dark Brand', 'Unlock by creating an account', '2025-11-01 00:02:07.809943+00', 'dark-brand', 'dark');