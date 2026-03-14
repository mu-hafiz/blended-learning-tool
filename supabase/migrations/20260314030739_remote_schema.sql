

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pg_cron" WITH SCHEMA "pg_catalog";






CREATE EXTENSION IF NOT EXISTS "pg_net" WITH SCHEMA "extensions";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE TYPE "public"."achievement_type" AS ENUM (
    'quizzes_completed',
    'quizzes_perfected',
    'quizzes_created',
    'flashcard_sets_completed',
    'flashcard_sets_created'
);


ALTER TYPE "public"."achievement_type" OWNER TO "postgres";


CREATE TYPE "public"."notification_type" AS ENUM (
    'friend_request_received',
    'friend_request_accepted',
    'like_received',
    'achievement_unlocked',
    'level_up'
);


ALTER TYPE "public"."notification_type" OWNER TO "postgres";


CREATE TYPE "public"."privacy_needed_type" AS ENUM (
    'public',
    'friends_only'
);


ALTER TYPE "public"."privacy_needed_type" OWNER TO "postgres";


COMMENT ON TYPE "public"."privacy_needed_type" IS 'Same as ''privacy_type'' but excluding ''private'' for features that friends will need to see';



CREATE TYPE "public"."privacy_type" AS ENUM (
    'public',
    'friends_only',
    'private'
);


ALTER TYPE "public"."privacy_type" OWNER TO "postgres";


CREATE TYPE "public"."semester_type" AS ENUM (
    'one',
    'two',
    'full'
);


ALTER TYPE "public"."semester_type" OWNER TO "postgres";


CREATE TYPE "public"."theme_type" AS ENUM (
    'light',
    'dark'
);


ALTER TYPE "public"."theme_type" OWNER TO "postgres";


CREATE TYPE "public"."user_type" AS ENUM (
    'student',
    'instructor'
);


ALTER TYPE "public"."user_type" OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_to_user_stat"("p_attr" "text", "p_amount" bigint, "p_course_id" "uuid" DEFAULT NULL::"uuid") RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $_$
BEGIN
  -- Validate attribute name (SQL injection protection)
  IF p_attr !~ '^[a-z_][a-z0-9_]*$' THEN
    RAISE EXCEPTION 'invalid attribute name "%"', p_attr;
  END IF;

  -- Ensure the column exists in the table
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'user_statistics'
      AND column_name  = p_attr
  ) THEN
    RAISE EXCEPTION 'column "%" does not exist in user_statistics', p_attr;
  END IF;

  -- Update the correct row (works for both NULL and non-NULL course_id)
  EXECUTE format(
    'UPDATE public.user_statistics
     SET %I = COALESCE(%I, 0) + $1
     WHERE user_id = auth.uid()
       AND course_id IS NOT DISTINCT FROM $2',
    p_attr, p_attr
  )
  USING p_amount, p_course_id;
END;
$_$;


ALTER FUNCTION "public"."add_to_user_stat"("p_attr" "text", "p_amount" bigint, "p_course_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."add_to_user_xp"("p_user_id" "uuid", "p_amount" integer) RETURNS "void"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$declare
  old_level integer;
  level_after integer;
  xp_after integer;
begin
  select level into old_level from users where user_id = p_user_id;

  update users
  set xp = xp + p_amount
  where user_id = p_user_id
  returning xp into xp_after;

  level_after := floor(xp_after / 500) + 1;

  if level_after > old_level then
    update users
    set level = level_after
    where user_id = p_user_id;

    insert into notifications (user_id, title, description, type)
    values (
      p_user_id,
      'Level Up!',
      format('Congratulations, you are now level %s', level_after),
      'level_up'
    );
  end if;

end;$$;


ALTER FUNCTION "public"."add_to_user_xp"("p_user_id" "uuid", "p_amount" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."daily_check_in"("p_user_id" "uuid") RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$declare
  new_streak int;
begin
  if (select daily_check_in from users where user_id = p_user_id) = false then
    -- Update current streak
    update user_statistics
    set current_streak = current_streak + 1
    where user_id = p_user_id
    returning current_streak into new_streak;

    -- Update best streak
    if new_streak > (select best_streak from user_statistics where user_id = p_user_id) then
      update user_statistics
      set best_streak = new_streak
      where user_id = p_user_id;
    end if;

    -- Add XP
    perform add_to_user_xp(p_user_id, 100);
  end if;

  -- Check in
  update users
  set daily_check_in = true
  where user_id = p_user_id;
end;$$;


ALTER FUNCTION "public"."daily_check_in"("p_user_id" "uuid") OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."daily_check_in_reset"() RETURNS "void"
    LANGUAGE "plpgsql"
    AS $$begin
  update user_statistics us
  set current_streak = 0
  from users u
  where us.user_id = u.user_id
    and us.course_id is null
    and u.daily_check_in = false;
  
  update users
  set daily_check_in = false
  where daily_check_in = true;
end;$$;


ALTER FUNCTION "public"."daily_check_in_reset"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
begin
  insert into public.users(user_id, theme_id)
  select new.id, t.id
  from public.themes t
  where t.title = 'Dark Brand';

  insert into public.user_statistics (user_id, course_id)
  values (new.id, null);

  insert into public.user_privacy(user_id)
  values (new.id);

  insert into public.unlocked_themes(user_id, theme_id)
  select new.id, t.id
  from public.themes t
  where t.title in ('Light Brand', 'Dark Brand');

  return new;
end;
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."achievements" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "unlock_criteria" "jsonb" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "type" "public"."achievement_type" NOT NULL,
    "description" "text" NOT NULL,
    "image_url" "text",
    "xp" bigint DEFAULT '50'::bigint NOT NULL
);


ALTER TABLE "public"."achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."courses" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "code" "text" NOT NULL,
    "semester" "public"."semester_type",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."courses" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."feature_flags" (
    "flag" "text" NOT NULL,
    "active" boolean DEFAULT true NOT NULL
);


ALTER TABLE "public"."feature_flags" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."notifications" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "title" "text" NOT NULL,
    "description" "text" NOT NULL,
    "type" "public"."notification_type" NOT NULL,
    "read" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."notifications" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."otp" (
    "email" "text" NOT NULL,
    "code" "text" NOT NULL,
    "delete_at" timestamp with time zone DEFAULT ("now"() + '00:05:00'::interval) NOT NULL
);


ALTER TABLE "public"."otp" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."themes" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "title" "text" NOT NULL,
    "unlock_criteria" "text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "data_theme" "text" NOT NULL,
    "type" "public"."theme_type" DEFAULT 'light'::"public"."theme_type" NOT NULL
);


ALTER TABLE "public"."themes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."unlocked_achievements" (
    "user_id" "uuid" NOT NULL,
    "achievement_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."unlocked_achievements" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."unlocked_themes" (
    "user_id" "uuid" NOT NULL,
    "theme_id" "uuid" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."unlocked_themes" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_privacy" (
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "profile" "public"."privacy_needed_type" DEFAULT 'public'::"public"."privacy_needed_type" NOT NULL,
    "name" "public"."privacy_type" DEFAULT 'friends_only'::"public"."privacy_type" NOT NULL,
    "level" "public"."privacy_needed_type" DEFAULT 'public'::"public"."privacy_needed_type" NOT NULL,
    "achievements" "public"."privacy_type" DEFAULT 'public'::"public"."privacy_type" NOT NULL,
    "friends" "public"."privacy_type" DEFAULT 'public'::"public"."privacy_type" NOT NULL,
    "leaderboards" "public"."privacy_needed_type" DEFAULT 'public'::"public"."privacy_needed_type" NOT NULL,
    "created_at" timestamp without time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_privacy" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."user_statistics" (
    "id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "user_id" "uuid" NOT NULL,
    "course_id" "uuid",
    "quizzes_completed" bigint DEFAULT '0'::bigint NOT NULL,
    "quizzes_perfected" bigint DEFAULT '0'::bigint NOT NULL,
    "quizzes_created" bigint DEFAULT '0'::bigint NOT NULL,
    "questions_correct" bigint DEFAULT '0'::bigint NOT NULL,
    "flashcard_sets_completed" bigint DEFAULT '0'::bigint NOT NULL,
    "flashcard_sets_created" bigint DEFAULT '0'::bigint NOT NULL,
    "flashcards_used" bigint DEFAULT '0'::bigint NOT NULL,
    "days_studied" bigint DEFAULT '0'::bigint NOT NULL,
    "current_streak" bigint DEFAULT '0'::bigint NOT NULL,
    "best_streak" bigint DEFAULT '0'::bigint NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL
);


ALTER TABLE "public"."user_statistics" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."users" (
    "username" "text" DEFAULT ('temp_'::"text" || "left"(("gen_random_uuid"())::"text", 8)) NOT NULL,
    "first_name" "text" DEFAULT ''::"text",
    "middle_name" "text" DEFAULT ''::"text",
    "last_name" "text" DEFAULT ''::"text",
    "created_at" timestamp with time zone DEFAULT "now"() NOT NULL,
    "role" "public"."user_type" DEFAULT 'student'::"public"."user_type",
    "user_id" "uuid" DEFAULT "gen_random_uuid"() NOT NULL,
    "about_me" "text" DEFAULT ''::"text",
    "deleted" boolean DEFAULT false NOT NULL,
    "theme_id" "uuid" DEFAULT 'cbf14722-49cd-471b-9ff3-20e31c92e2bb'::"uuid" NOT NULL,
    "level" bigint DEFAULT '1'::bigint NOT NULL,
    "xp" bigint DEFAULT '0'::bigint NOT NULL,
    "onboarding_completed" boolean DEFAULT false NOT NULL,
    "daily_check_in" boolean DEFAULT false NOT NULL,
    CONSTRAINT "users_first_name_check" CHECK (("first_name" ~ '^[A-Za-zÀ-ÖØ-öø-ÿ'' -]*$'::"text")),
    CONSTRAINT "users_last_name_check" CHECK (("last_name" ~ '^[A-Za-zÀ-ÖØ-öø-ÿ'' -]*$'::"text")),
    CONSTRAINT "users_middle_name_check" CHECK (("middle_name" ~ '^[A-Za-zÀ-ÖØ-öø-ÿ'' -]*$'::"text")),
    CONSTRAINT "users_username_check" CHECK (("length"("username") <= 30))
);


ALTER TABLE "public"."users" OWNER TO "postgres";


ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."achievements"
    ADD CONSTRAINT "achievements_title_key" UNIQUE ("title");



ALTER TABLE ONLY "public"."courses"
    ADD CONSTRAINT "courses_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."feature_flags"
    ADD CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("flag");



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."otp"
    ADD CONSTRAINT "otp_pkey" PRIMARY KEY ("email");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."themes"
    ADD CONSTRAINT "themes_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."themes"
    ADD CONSTRAINT "themes_title_key" UNIQUE ("title");



ALTER TABLE ONLY "public"."unlocked_achievements"
    ADD CONSTRAINT "unlocked_achievements_pkey" PRIMARY KEY ("user_id", "achievement_id");



ALTER TABLE ONLY "public"."unlocked_themes"
    ADD CONSTRAINT "unlocked_themes_pkey" PRIMARY KEY ("user_id", "theme_id");



ALTER TABLE ONLY "public"."user_privacy"
    ADD CONSTRAINT "user_privacy_pkey" PRIMARY KEY ("user_id");



ALTER TABLE ONLY "public"."user_statistics"
    ADD CONSTRAINT "user_statistics_pkey" PRIMARY KEY ("id");



CREATE UNIQUE INDEX "user_course_unique" ON "public"."user_statistics" USING "btree" ("user_id", "course_id") WHERE ("course_id" IS NOT NULL);



CREATE UNIQUE INDEX "user_misc_stats_unique" ON "public"."user_statistics" USING "btree" ("user_id") WHERE ("course_id" IS NULL);



CREATE UNIQUE INDEX "username_unique_not_deleted" ON "public"."users" USING "btree" ("username") WHERE ("deleted" = false);



ALTER TABLE ONLY "public"."notifications"
    ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON UPDATE CASCADE ON DELETE CASCADE;



ALTER TABLE ONLY "public"."unlocked_achievements"
    ADD CONSTRAINT "unlocked_achievements_achievement_id_fkey" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."unlocked_achievements"
    ADD CONSTRAINT "unlocked_achievements_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."unlocked_themes"
    ADD CONSTRAINT "unlocked_themes_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."unlocked_themes"
    ADD CONSTRAINT "unlocked_themes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."user_privacy"
    ADD CONSTRAINT "user_privacy_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id");



ALTER TABLE ONLY "public"."user_statistics"
    ADD CONSTRAINT "user_statistics_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "public"."courses"("id");



ALTER TABLE ONLY "public"."user_statistics"
    ADD CONSTRAINT "user_statistics_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id");



ALTER TABLE ONLY "public"."users"
    ADD CONSTRAINT "users_theme_id_fkey" FOREIGN KEY ("theme_id") REFERENCES "public"."themes"("id");



CREATE POLICY "Everyone can create their own privacy" ON "public"."user_privacy" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Everyone can create their own statistics" ON "public"."user_statistics" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Everyone can see available achievements" ON "public"."achievements" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can see everyone's privacy" ON "public"."user_privacy" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can see everyone's statistics" ON "public"."user_statistics" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Everyone can see the feature flags" ON "public"."feature_flags" FOR SELECT USING (true);



CREATE POLICY "Everyone can see themes" ON "public"."themes" FOR SELECT USING (true);



CREATE POLICY "Everyone can update their own privacy" ON "public"."user_privacy" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Everyone can update their own statistics" ON "public"."user_statistics" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "No access to OTP codes" ON "public"."otp" USING (false) WITH CHECK (false);



CREATE POLICY "Users can add their own achievements" ON "public"."unlocked_achievements" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can create their own profile" ON "public"."users" FOR INSERT TO "authenticated" WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users can see everyone's achievements" ON "public"."unlocked_achievements" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can see everyone's unlocked themes" ON "public"."unlocked_themes" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Users can select users that have done onboarding" ON "public"."users" FOR SELECT TO "authenticated" USING (((( SELECT "auth"."uid"() AS "uid") = "user_id") OR ("onboarding_completed" = true)));



CREATE POLICY "Users can update their own profile" ON "public"."users" FOR UPDATE TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



CREATE POLICY "Users have full access to their notifications" ON "public"."notifications" TO "authenticated" USING ((( SELECT "auth"."uid"() AS "uid") = "user_id")) WITH CHECK ((( SELECT "auth"."uid"() AS "uid") = "user_id"));



ALTER TABLE "public"."achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."courses" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."feature_flags" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."notifications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."otp" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."themes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."unlocked_achievements" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."unlocked_themes" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_privacy" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_statistics" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."users" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";






ALTER PUBLICATION "supabase_realtime" ADD TABLE ONLY "public"."notifications";









GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";














































































































































































GRANT ALL ON FUNCTION "public"."add_to_user_stat"("p_attr" "text", "p_amount" bigint, "p_course_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."add_to_user_stat"("p_attr" "text", "p_amount" bigint, "p_course_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_to_user_stat"("p_attr" "text", "p_amount" bigint, "p_course_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."add_to_user_xp"("p_user_id" "uuid", "p_amount" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."add_to_user_xp"("p_user_id" "uuid", "p_amount" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."add_to_user_xp"("p_user_id" "uuid", "p_amount" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."daily_check_in"("p_user_id" "uuid") TO "anon";
GRANT ALL ON FUNCTION "public"."daily_check_in"("p_user_id" "uuid") TO "authenticated";
GRANT ALL ON FUNCTION "public"."daily_check_in"("p_user_id" "uuid") TO "service_role";



GRANT ALL ON FUNCTION "public"."daily_check_in_reset"() TO "anon";
GRANT ALL ON FUNCTION "public"."daily_check_in_reset"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."daily_check_in_reset"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";
























GRANT ALL ON TABLE "public"."achievements" TO "anon";
GRANT ALL ON TABLE "public"."achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."achievements" TO "service_role";



GRANT ALL ON TABLE "public"."courses" TO "anon";
GRANT ALL ON TABLE "public"."courses" TO "authenticated";
GRANT ALL ON TABLE "public"."courses" TO "service_role";



GRANT ALL ON TABLE "public"."feature_flags" TO "anon";
GRANT ALL ON TABLE "public"."feature_flags" TO "authenticated";
GRANT ALL ON TABLE "public"."feature_flags" TO "service_role";



GRANT ALL ON TABLE "public"."notifications" TO "anon";
GRANT ALL ON TABLE "public"."notifications" TO "authenticated";
GRANT ALL ON TABLE "public"."notifications" TO "service_role";



GRANT ALL ON TABLE "public"."otp" TO "anon";
GRANT ALL ON TABLE "public"."otp" TO "authenticated";
GRANT ALL ON TABLE "public"."otp" TO "service_role";



GRANT ALL ON TABLE "public"."themes" TO "anon";
GRANT ALL ON TABLE "public"."themes" TO "authenticated";
GRANT ALL ON TABLE "public"."themes" TO "service_role";



GRANT ALL ON TABLE "public"."unlocked_achievements" TO "anon";
GRANT ALL ON TABLE "public"."unlocked_achievements" TO "authenticated";
GRANT ALL ON TABLE "public"."unlocked_achievements" TO "service_role";



GRANT ALL ON TABLE "public"."unlocked_themes" TO "anon";
GRANT ALL ON TABLE "public"."unlocked_themes" TO "authenticated";
GRANT ALL ON TABLE "public"."unlocked_themes" TO "service_role";



GRANT ALL ON TABLE "public"."user_privacy" TO "anon";
GRANT ALL ON TABLE "public"."user_privacy" TO "authenticated";
GRANT ALL ON TABLE "public"."user_privacy" TO "service_role";



GRANT ALL ON TABLE "public"."user_statistics" TO "anon";
GRANT ALL ON TABLE "public"."user_statistics" TO "authenticated";
GRANT ALL ON TABLE "public"."user_statistics" TO "service_role";



GRANT ALL ON TABLE "public"."users" TO "anon";
GRANT ALL ON TABLE "public"."users" TO "authenticated";
GRANT ALL ON TABLE "public"."users" TO "service_role";









ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES TO "service_role";






























CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


