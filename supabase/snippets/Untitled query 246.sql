create or replace function add_to_user_stat(
  p_attr text,
  p_amount bigint
)
returns void
language plpgsql
security definer
as $$
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

  -- Update the user's statistic
  EXECUTE format(
    'UPDATE public.user_statistics
     SET %I = COALESCE(%I, 0) + $1
     WHERE user_id = auth.uid()',
    p_attr, p_attr
  )
  USING p_amount;
END;
$$;