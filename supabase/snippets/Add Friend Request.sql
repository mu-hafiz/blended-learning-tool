create or replace function add_friend_request(
  p_sender_id uuid,
  p_receiver_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  sender_username text;
begin
  -- Cannot send request to yourself
  if p_sender_id = p_receiver_id then
    raise exception 'Sender and receiver cannot be same user ID';
  end if;

  -- Cannot send multiple requests
  if exists (
    select 1 from friend_requests
    where sender_id = p_sender_id
      and receiver_id = p_receiver_id
  ) then
    raise exception 'Already friends';
  end if;

  -- Add friend request
  insert into friend_requests (sender_id, receiver_id)
  values (p_sender_id, p_receiver_id);

  -- Get sender's username
  select username
  into sender_username
  from users
  where user_id = p_sender_id;

  -- Add notification
  insert into notifications (user_id, title, description, type)
  values (
    p_receiver_id,
    'Friend Request Received',
    format('%s wants to be your friend!', sender_username),
    'friend_request_received'
  );
end;
$$;