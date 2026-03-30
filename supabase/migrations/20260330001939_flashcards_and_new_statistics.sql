drop function if exists "public"."add_to_user_stat"(p_attr text, p_amount bigint, p_course_id uuid);

alter type "public"."achievement_type" rename to "achievement_type__old_version_to_be_dropped";

create type "public"."achievement_type" as enum ('flashcard_sets_completed', 'flashcard_sets_created', 'flashcards_used', 'flashcards_correct');


  create table "public"."flashcard_bookmarks" (
    "flashcard_set_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."flashcard_bookmarks" enable row level security;


  create table "public"."flashcard_history" (
    "id" uuid not null default gen_random_uuid(),
    "flashcard_set_id" uuid not null,
    "user_id" uuid not null,
    "total_cards" bigint not null,
    "correct_cards" bigint not null,
    "created_at" timestamp with time zone not null default now(),
    "xp_earned" bigint not null default '0'::bigint
      );


alter table "public"."flashcard_history" enable row level security;


  create table "public"."flashcard_likes" (
    "flashcard_set_id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now()
      );


alter table "public"."flashcard_likes" enable row level security;


  create table "public"."flashcard_sets" (
    "creator_id" uuid not null,
    "title" text not null,
    "description" text not null default ''::text,
    "likes" bigint not null default '0'::bigint,
    "num_of_flashcards" bigint not null default '0'::bigint,
    "tags" text[] not null default '{}'::text[],
    "created_at" timestamp with time zone not null default now(),
    "updated_at" timestamp with time zone not null default now(),
    "private" boolean not null default false,
    "id" uuid not null default gen_random_uuid(),
    "bookmarks" bigint not null default '0'::bigint
      );


alter table "public"."flashcard_sets" enable row level security;


  create table "public"."flashcards" (
    "flashcard_set_id" uuid not null,
    "front" text not null,
    "back" text not null,
    "order" bigint not null,
    "id" uuid not null default gen_random_uuid()
      );


alter table "public"."flashcards" enable row level security;

alter table "public"."achievements" alter column type type "public"."achievement_type" using type::text::"public"."achievement_type";

drop type "public"."achievement_type__old_version_to_be_dropped";

alter table "public"."user_statistics" add column "flashcards_correct" bigint not null default '0'::bigint;

CREATE UNIQUE INDEX flashcard_bookmarks_pkey ON public.flashcard_bookmarks USING btree (flashcard_set_id, user_id);

CREATE UNIQUE INDEX flashcard_history_pkey ON public.flashcard_history USING btree (id);

CREATE UNIQUE INDEX flashcard_likes_pkey ON public.flashcard_likes USING btree (flashcard_set_id, user_id);

CREATE UNIQUE INDEX flashcard_sets_pkey ON public.flashcard_sets USING btree (id);

CREATE UNIQUE INDEX flashcards_pkey ON public.flashcards USING btree (id);

alter table "public"."flashcard_bookmarks" add constraint "flashcard_bookmarks_pkey" PRIMARY KEY using index "flashcard_bookmarks_pkey";

alter table "public"."flashcard_history" add constraint "flashcard_history_pkey" PRIMARY KEY using index "flashcard_history_pkey";

alter table "public"."flashcard_likes" add constraint "flashcard_likes_pkey" PRIMARY KEY using index "flashcard_likes_pkey";

alter table "public"."flashcard_sets" add constraint "flashcard_sets_pkey" PRIMARY KEY using index "flashcard_sets_pkey";

alter table "public"."flashcards" add constraint "flashcards_pkey" PRIMARY KEY using index "flashcards_pkey";

alter table "public"."flashcard_bookmarks" add constraint "flashcard_bookmarks_flashcard_set_id_fkey" FOREIGN KEY (flashcard_set_id) REFERENCES public.flashcard_sets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_bookmarks" validate constraint "flashcard_bookmarks_flashcard_set_id_fkey";

alter table "public"."flashcard_bookmarks" add constraint "flashcard_bookmarks_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_bookmarks" validate constraint "flashcard_bookmarks_user_id_fkey";

alter table "public"."flashcard_history" add constraint "flashcard_history_flashcard_set_id_fkey" FOREIGN KEY (flashcard_set_id) REFERENCES public.flashcard_sets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_history" validate constraint "flashcard_history_flashcard_set_id_fkey";

alter table "public"."flashcard_history" add constraint "flashcard_history_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_history" validate constraint "flashcard_history_user_id_fkey";

alter table "public"."flashcard_likes" add constraint "flashcard_likes_flashcard_set_id_fkey" FOREIGN KEY (flashcard_set_id) REFERENCES public.flashcard_sets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_likes" validate constraint "flashcard_likes_flashcard_set_id_fkey";

alter table "public"."flashcard_likes" add constraint "flashcard_likes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_likes" validate constraint "flashcard_likes_user_id_fkey";

alter table "public"."flashcard_sets" add constraint "flashcard_sets_creator_id_fkey" FOREIGN KEY (creator_id) REFERENCES public.users(user_id) not valid;

alter table "public"."flashcard_sets" validate constraint "flashcard_sets_creator_id_fkey";

alter table "public"."flashcards" add constraint "flashcards_flashcard_set_id_fkey" FOREIGN KEY (flashcard_set_id) REFERENCES public.flashcard_sets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcards" validate constraint "flashcards_flashcard_set_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_to_user_stat(p_attr text, p_amount bigint)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.handle_flashcard_bookmark()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if (tg_op = 'INSERT') then
    update flashcard_sets
    set bookmarks = bookmarks + 1
    where id = new.flashcard_set_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update flashcard_sets
    set bookmarks = bookmarks - 1
    where id = old.flashcard_set_id;
    return old;
  end if;
  return null;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_flashcard_like()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  if (tg_op = 'INSERT') then
    update flashcard_sets
    set likes = likes + 1
    where id = new.flashcard_set_id;
    return new;
  elsif (tg_op = 'DELETE') then
    update flashcard_sets
    set likes = likes - 1
    where id = old.flashcard_set_id;
    return old;
  end if;
  return null;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.submit_flashcard_results(p_user_id uuid, p_flashcard_set_id uuid, p_total_cards integer, p_correct_cards integer)
 RETURNS integer
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

grant delete on table "public"."flashcard_bookmarks" to "anon";

grant insert on table "public"."flashcard_bookmarks" to "anon";

grant references on table "public"."flashcard_bookmarks" to "anon";

grant select on table "public"."flashcard_bookmarks" to "anon";

grant trigger on table "public"."flashcard_bookmarks" to "anon";

grant truncate on table "public"."flashcard_bookmarks" to "anon";

grant update on table "public"."flashcard_bookmarks" to "anon";

grant delete on table "public"."flashcard_bookmarks" to "authenticated";

grant insert on table "public"."flashcard_bookmarks" to "authenticated";

grant references on table "public"."flashcard_bookmarks" to "authenticated";

grant select on table "public"."flashcard_bookmarks" to "authenticated";

grant trigger on table "public"."flashcard_bookmarks" to "authenticated";

grant truncate on table "public"."flashcard_bookmarks" to "authenticated";

grant update on table "public"."flashcard_bookmarks" to "authenticated";

grant delete on table "public"."flashcard_bookmarks" to "service_role";

grant insert on table "public"."flashcard_bookmarks" to "service_role";

grant references on table "public"."flashcard_bookmarks" to "service_role";

grant select on table "public"."flashcard_bookmarks" to "service_role";

grant trigger on table "public"."flashcard_bookmarks" to "service_role";

grant truncate on table "public"."flashcard_bookmarks" to "service_role";

grant update on table "public"."flashcard_bookmarks" to "service_role";

grant delete on table "public"."flashcard_history" to "anon";

grant insert on table "public"."flashcard_history" to "anon";

grant references on table "public"."flashcard_history" to "anon";

grant select on table "public"."flashcard_history" to "anon";

grant trigger on table "public"."flashcard_history" to "anon";

grant truncate on table "public"."flashcard_history" to "anon";

grant update on table "public"."flashcard_history" to "anon";

grant delete on table "public"."flashcard_history" to "authenticated";

grant insert on table "public"."flashcard_history" to "authenticated";

grant references on table "public"."flashcard_history" to "authenticated";

grant select on table "public"."flashcard_history" to "authenticated";

grant trigger on table "public"."flashcard_history" to "authenticated";

grant truncate on table "public"."flashcard_history" to "authenticated";

grant update on table "public"."flashcard_history" to "authenticated";

grant delete on table "public"."flashcard_history" to "service_role";

grant insert on table "public"."flashcard_history" to "service_role";

grant references on table "public"."flashcard_history" to "service_role";

grant select on table "public"."flashcard_history" to "service_role";

grant trigger on table "public"."flashcard_history" to "service_role";

grant truncate on table "public"."flashcard_history" to "service_role";

grant update on table "public"."flashcard_history" to "service_role";

grant delete on table "public"."flashcard_likes" to "anon";

grant insert on table "public"."flashcard_likes" to "anon";

grant references on table "public"."flashcard_likes" to "anon";

grant select on table "public"."flashcard_likes" to "anon";

grant trigger on table "public"."flashcard_likes" to "anon";

grant truncate on table "public"."flashcard_likes" to "anon";

grant update on table "public"."flashcard_likes" to "anon";

grant delete on table "public"."flashcard_likes" to "authenticated";

grant insert on table "public"."flashcard_likes" to "authenticated";

grant references on table "public"."flashcard_likes" to "authenticated";

grant select on table "public"."flashcard_likes" to "authenticated";

grant trigger on table "public"."flashcard_likes" to "authenticated";

grant truncate on table "public"."flashcard_likes" to "authenticated";

grant update on table "public"."flashcard_likes" to "authenticated";

grant delete on table "public"."flashcard_likes" to "service_role";

grant insert on table "public"."flashcard_likes" to "service_role";

grant references on table "public"."flashcard_likes" to "service_role";

grant select on table "public"."flashcard_likes" to "service_role";

grant trigger on table "public"."flashcard_likes" to "service_role";

grant truncate on table "public"."flashcard_likes" to "service_role";

grant update on table "public"."flashcard_likes" to "service_role";

grant delete on table "public"."flashcard_sets" to "anon";

grant insert on table "public"."flashcard_sets" to "anon";

grant references on table "public"."flashcard_sets" to "anon";

grant select on table "public"."flashcard_sets" to "anon";

grant trigger on table "public"."flashcard_sets" to "anon";

grant truncate on table "public"."flashcard_sets" to "anon";

grant update on table "public"."flashcard_sets" to "anon";

grant delete on table "public"."flashcard_sets" to "authenticated";

grant insert on table "public"."flashcard_sets" to "authenticated";

grant references on table "public"."flashcard_sets" to "authenticated";

grant select on table "public"."flashcard_sets" to "authenticated";

grant trigger on table "public"."flashcard_sets" to "authenticated";

grant truncate on table "public"."flashcard_sets" to "authenticated";

grant update on table "public"."flashcard_sets" to "authenticated";

grant delete on table "public"."flashcard_sets" to "service_role";

grant insert on table "public"."flashcard_sets" to "service_role";

grant references on table "public"."flashcard_sets" to "service_role";

grant select on table "public"."flashcard_sets" to "service_role";

grant trigger on table "public"."flashcard_sets" to "service_role";

grant truncate on table "public"."flashcard_sets" to "service_role";

grant update on table "public"."flashcard_sets" to "service_role";

grant delete on table "public"."flashcards" to "anon";

grant insert on table "public"."flashcards" to "anon";

grant references on table "public"."flashcards" to "anon";

grant select on table "public"."flashcards" to "anon";

grant trigger on table "public"."flashcards" to "anon";

grant truncate on table "public"."flashcards" to "anon";

grant update on table "public"."flashcards" to "anon";

grant delete on table "public"."flashcards" to "authenticated";

grant insert on table "public"."flashcards" to "authenticated";

grant references on table "public"."flashcards" to "authenticated";

grant select on table "public"."flashcards" to "authenticated";

grant trigger on table "public"."flashcards" to "authenticated";

grant truncate on table "public"."flashcards" to "authenticated";

grant update on table "public"."flashcards" to "authenticated";

grant delete on table "public"."flashcards" to "service_role";

grant insert on table "public"."flashcards" to "service_role";

grant references on table "public"."flashcards" to "service_role";

grant select on table "public"."flashcards" to "service_role";

grant trigger on table "public"."flashcards" to "service_role";

grant truncate on table "public"."flashcards" to "service_role";

grant update on table "public"."flashcards" to "service_role";


  create policy "Users can create their own bookmarks"
  on "public"."flashcard_bookmarks"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can delete their own bookmarks"
  on "public"."flashcard_bookmarks"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can see their own bookmarks"
  on "public"."flashcard_bookmarks"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can add their own history"
  on "public"."flashcard_history"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can see their own history"
  on "public"."flashcard_history"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can add their own likes"
  on "public"."flashcard_likes"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can remove their own likes"
  on "public"."flashcard_likes"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can see their own likes"
  on "public"."flashcard_likes"
  as permissive
  for select
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Everyone can see everyone's flashcard sets"
  on "public"."flashcard_sets"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can create their own flashcard sets"
  on "public"."flashcard_sets"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can delete their own flashcard sets"
  on "public"."flashcard_sets"
  as permissive
  for delete
  to authenticated
using ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can update their own flashcard sets"
  on "public"."flashcard_sets"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = creator_id))
with check ((( SELECT auth.uid() AS uid) = creator_id));



  create policy "Users can create flashcards for their own sets"
  on "public"."flashcards"
  as permissive
  for insert
  to authenticated
with check ((EXISTS ( SELECT 1
   FROM public.flashcard_sets
  WHERE ((flashcard_sets.id = flashcards.flashcard_set_id) AND (flashcard_sets.creator_id = auth.uid())))));



  create policy "Users can delete flashcards from their own sets"
  on "public"."flashcards"
  as permissive
  for delete
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.flashcard_sets
  WHERE ((flashcard_sets.id = flashcards.flashcard_set_id) AND (flashcard_sets.creator_id = auth.uid())))));



  create policy "Users can see all flashcards"
  on "public"."flashcards"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can update flashcards to their own sets"
  on "public"."flashcards"
  as permissive
  for update
  to authenticated
using ((EXISTS ( SELECT 1
   FROM public.flashcard_sets
  WHERE ((flashcard_sets.id = flashcards.flashcard_set_id) AND (flashcard_sets.creator_id = auth.uid())))))
with check ((EXISTS ( SELECT 1
   FROM public.flashcard_sets
  WHERE ((flashcard_sets.id = flashcards.flashcard_set_id) AND (flashcard_sets.creator_id = auth.uid())))));


CREATE TRIGGER flashcard_bookmark_trigger AFTER INSERT OR DELETE ON public.flashcard_bookmarks FOR EACH ROW EXECUTE FUNCTION public.handle_flashcard_bookmark();

CREATE TRIGGER flashcard_like_trigger AFTER INSERT OR DELETE ON public.flashcard_likes FOR EACH ROW EXECUTE FUNCTION public.handle_flashcard_like();


