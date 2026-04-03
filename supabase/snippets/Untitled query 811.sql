create or replace function send_comment_notification()
returns trigger
language plpgsql
security definer
as $$
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
$$;

drop trigger if exists flashcard_comment_trigger on flashcard_comments;

create trigger flashcard_comment_trigger
after insert on flashcard_comments
for each row
execute function send_comment_notification();