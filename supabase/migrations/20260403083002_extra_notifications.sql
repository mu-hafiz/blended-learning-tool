alter table "public"."users" drop constraint "users_first_name_check";

alter table "public"."users" drop constraint "users_last_name_check";

alter table "public"."users" drop constraint "users_middle_name_check";

alter table "public"."users" drop constraint "users_username_check";

alter type "public"."notification_type" rename to "notification_type__old_version_to_be_dropped";

create type "public"."notification_type" as enum ('friend_request_received', 'friend_request_accepted', 'like_received', 'achievement_unlocked', 'level_up', 'theme_unlocked', 'comment_received', 'bookmark_received');

alter table "public"."notifications" alter column type type "public"."notification_type" using type::text::"public"."notification_type";

drop type "public"."notification_type__old_version_to_be_dropped";

alter table "public"."flashcard_bookmarks" add column "notification_sent" boolean not null default false;

alter table "public"."flashcard_comments" add column "notification_sent" boolean not null default false;

alter table "public"."flashcard_likes" add column "notification_sent" boolean not null default false;

alter table "public"."notifications" add column "link" text;

alter table "public"."users" add constraint "users_first_name_check" CHECK (((first_name ~ '^[A-Za-zÀ-ÖØ-öø-ÿ'' -]*$'::text) AND (length(first_name) <= 50))) not valid;

alter table "public"."users" validate constraint "users_first_name_check";

alter table "public"."users" add constraint "users_last_name_check" CHECK (((last_name ~ '^[A-Za-zÀ-ÖØ-öø-ÿ'' -]*$'::text) AND (length(last_name) <= 50))) not valid;

alter table "public"."users" validate constraint "users_last_name_check";

alter table "public"."users" add constraint "users_middle_name_check" CHECK (((middle_name ~ '^[A-Za-zÀ-ÖØ-öø-ÿ'' -]*$'::text) AND (length(middle_name) <= 50))) not valid;

alter table "public"."users" validate constraint "users_middle_name_check";

alter table "public"."users" add constraint "users_username_check" CHECK ((username ~ '^[a-z0-9_]{4,30}$'::text)) not valid;

alter table "public"."users" validate constraint "users_username_check";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.send_comment_notification()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  comment_username text;
  commenter_id uuid;
  flashcard_set_name text;
  receiver_id uuid;
begin
  commenter_id := new.user_id;

  select username
  into comment_username
  from users
  where user_id = new.user_id;

  if new.reply_to_user_id is not null then
    receiver_id := new.reply_to_user_id;

    select title
    into flashcard_set_name
    from flashcard_sets
    where id = new.flashcard_set_id;
  else
    select creator_id, title
    into receiver_id, flashcard_set_name
    from flashcard_sets
    where id = new.flashcard_set_id;
  end if;

  if commenter_id <> receiver_id then

    if new.reply_to_user_id is not null then
      insert into notifications (user_id, title, description, type, link)
      values (
        receiver_id,
        format('%s sent a reply!', comment_username),
        format('There is a new reply on "%s"', flashcard_set_name),
        'comment_received',
        format('/flashcards/%s', new.flashcard_set_id)
      );
    else
      insert into notifications (user_id, title, description, type, link)
      values (
        receiver_id,
        format('%s sent a comment!', comment_username),
        format('There is a new comment on "%s"', flashcard_set_name),
        'comment_received',
        format('/flashcards/%s', new.flashcard_set_id)
      );
    end if;

  end if;

  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.send_like_bookmark_notification()
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin

  insert into notifications (user_id, title, description, type, link)
  select
    fs.creator_id,
    format('%s liked your flashcard set!', u.username),
    format('You have a new like on "%s"', fs.title),
    'like_received',
    format('/flashcards/%s', l.flashcard_set_id)
  from flashcard_likes l
  join flashcard_sets fs on l.flashcard_set_id = fs.id
  join users u on l.user_id = u.user_id
  where l.notification_sent = false
    and l.created_at < now() - interval '1 minute'
    and fs.creator_id != u.user_id;

  insert into notifications (user_id, title, description, type, link)
  select
    fs.creator_id,
    format('%s bookmarked your flashcard set!', u.username),
    format('You have a new bookmark on "%s"', fs.title),
    'bookmark_received',
    format('/flashcards/%s', b.flashcard_set_id)
  from flashcard_bookmarks b
  join flashcard_sets fs on b.flashcard_set_id = fs.id
  join users u on b.user_id = u.user_id
  where b.notification_sent = false
    and b.created_at < now() - interval '1 minute'
    and fs.creator_id != u.user_id;

  update flashcard_likes
  set notification_sent = true
  where notification_sent = false
    and created_at < now() - interval '1 minute';
  
  update flashcard_bookmarks
  set notification_sent = true
  where notification_sent = false
    and created_at < now() - interval '1 minute';

end;
$function$
;

CREATE OR REPLACE FUNCTION public.add_to_user_xp(p_user_id uuid, p_amount integer)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$declare
  old_level integer;
  level_after integer;
  xp_after integer;
begin
  select level into old_level from users where user_id = p_user_id;

  update users
  set xp = xp + p_amount
  where user_id = p_user_id
  returning xp into xp_after;

  level_after := floor(xp_after / 250) + 1;

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

end;$function$
;

CREATE OR REPLACE FUNCTION public.handle_flashcard_bookmark()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
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
 SECURITY DEFINER
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

CREATE OR REPLACE FUNCTION public.recalculate_achievement_percentages()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
declare
  user_count int;
  unlocked_count int;
  achievement record;
begin

  select count(*)
  into user_count
  from users;

  if user_count <= 0 then
    raise exception 'Number of users is zero, which should not happen';
  end if;

  for achievement in select id from achievements loop
    select count(*)
    into unlocked_count
    from unlocked_achievements
    where achievement_id = achievement.id;

    update achievements
    set percentage = ROUND((unlocked_count::numeric / user_count) * 100)
    where id = achievement.id;
  end loop;

  return new;

end;
$function$
;

CREATE TRIGGER flashcard_comment_trigger AFTER INSERT ON public.flashcard_comments FOR EACH ROW EXECUTE FUNCTION public.send_comment_notification();


