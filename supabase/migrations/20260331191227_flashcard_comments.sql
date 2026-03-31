
  create table "public"."flashcard_comments" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null,
    "parent_id" uuid,
    "reply_to_user_id" uuid,
    "comment" text not null,
    "created_at" timestamp with time zone not null default now(),
    "deleted" boolean not null default false,
    "flashcard_set_id" uuid not null
      );


alter table "public"."flashcard_comments" enable row level security;

CREATE UNIQUE INDEX flashcard_comments_pkey ON public.flashcard_comments USING btree (id);

alter table "public"."flashcard_comments" add constraint "flashcard_comments_pkey" PRIMARY KEY using index "flashcard_comments_pkey";

alter table "public"."flashcard_comments" add constraint "flashcard_comments_flashcard_set_id_fkey" FOREIGN KEY (flashcard_set_id) REFERENCES public.flashcard_sets(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_comments" validate constraint "flashcard_comments_flashcard_set_id_fkey";

alter table "public"."flashcard_comments" add constraint "flashcard_comments_parent_id_fkey" FOREIGN KEY (parent_id) REFERENCES public.flashcard_comments(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_comments" validate constraint "flashcard_comments_parent_id_fkey";

alter table "public"."flashcard_comments" add constraint "flashcard_comments_reply_to_user_id_fkey" FOREIGN KEY (reply_to_user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_comments" validate constraint "flashcard_comments_reply_to_user_id_fkey";

alter table "public"."flashcard_comments" add constraint "flashcard_comments_user_id_fkey" FOREIGN KEY (user_id) REFERENCES public.users(user_id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."flashcard_comments" validate constraint "flashcard_comments_user_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.create_flashcard_set(p_user_id uuid, p_title text, p_description text, p_private boolean, p_flashcards jsonb, p_tags text[])
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  new_flashcard_set_id uuid;
begin

  if jsonb_array_length(p_flashcards) <= 0 then
    raise exception 'Must have at least one flashcard';
  end if;

  insert into flashcard_sets (creator_id, title, description, private, num_of_flashcards, tags)
  values (p_user_id, p_title, p_description, p_private, jsonb_array_length(p_flashcards), p_tags)
  returning id into new_flashcard_set_id;

  insert into flashcards (flashcard_set_id, front, back, "order")
    select
      new_flashcard_set_id,
      card->>'front',
      card->>'back',
      row_number() over ()
    from jsonb_array_elements(p_flashcards) as card;
  
  update user_statistics
  set flashcard_sets_created = flashcard_sets_created + 1
  where user_id = p_user_id;

  return new_flashcard_set_id;
  
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_flashcard_set(p_flashcard_set_id uuid, p_user_id uuid, p_title text, p_description text, p_private boolean, p_flashcards jsonb, p_tags text[])
 RETURNS uuid
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

grant delete on table "public"."flashcard_comments" to "anon";

grant insert on table "public"."flashcard_comments" to "anon";

grant references on table "public"."flashcard_comments" to "anon";

grant select on table "public"."flashcard_comments" to "anon";

grant trigger on table "public"."flashcard_comments" to "anon";

grant truncate on table "public"."flashcard_comments" to "anon";

grant update on table "public"."flashcard_comments" to "anon";

grant delete on table "public"."flashcard_comments" to "authenticated";

grant insert on table "public"."flashcard_comments" to "authenticated";

grant references on table "public"."flashcard_comments" to "authenticated";

grant select on table "public"."flashcard_comments" to "authenticated";

grant trigger on table "public"."flashcard_comments" to "authenticated";

grant truncate on table "public"."flashcard_comments" to "authenticated";

grant update on table "public"."flashcard_comments" to "authenticated";

grant delete on table "public"."flashcard_comments" to "service_role";

grant insert on table "public"."flashcard_comments" to "service_role";

grant references on table "public"."flashcard_comments" to "service_role";

grant select on table "public"."flashcard_comments" to "service_role";

grant trigger on table "public"."flashcard_comments" to "service_role";

grant truncate on table "public"."flashcard_comments" to "service_role";

grant update on table "public"."flashcard_comments" to "service_role";


  create policy "Everyone can see all comments"
  on "public"."flashcard_comments"
  as permissive
  for select
  to authenticated
using (true);



  create policy "Users can create their own comments"
  on "public"."flashcard_comments"
  as permissive
  for insert
  to authenticated
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update their comments"
  on "public"."flashcard_comments"
  as permissive
  for update
  to authenticated
using ((( SELECT auth.uid() AS uid) = user_id))
with check ((( SELECT auth.uid() AS uid) = user_id));



