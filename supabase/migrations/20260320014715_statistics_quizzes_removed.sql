alter table "public"."user_statistics" drop column "questions_correct";

alter table "public"."user_statistics" drop column "quizzes_completed";

alter table "public"."user_statistics" drop column "quizzes_created";

alter table "public"."user_statistics" drop column "quizzes_perfected";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_to_user_stat(p_attr text, p_amount bigint, p_course_id uuid DEFAULT NULL::uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$BEGIN
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
     WHERE user_id = auth.uid()',
    p_attr, p_attr
  )
  USING p_amount, p_course_id;
END;$function$
;


