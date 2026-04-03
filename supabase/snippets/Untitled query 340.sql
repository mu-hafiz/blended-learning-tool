create or replace function send_like_bookmark_notification()
returns void
language plpgsql
security definer
as $$
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
    format('%s liked your flashcard set!', u.username),
    format('You have a new like on "%s"', fs.title),
    'like_received',
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
$$;