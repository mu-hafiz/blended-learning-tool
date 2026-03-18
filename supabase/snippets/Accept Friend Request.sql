create or replace function accept_friend_request(
  p_accept_id uuid,
  p_sender_id uuid
)
returns void
language plpgsql
security definer
as $$
declare
  accepter_username text;
begin
  -- Cannot send request to yourself
  if p_accept_id = p_sender_id then
    raise exception 'Both user IDs cannot be the same';
  end if;

  -- Add friend request
  insert into friends (user_id_1, user_id_2)
  values (p_accept_id, p_sender_id);

  -- Remove friend request
  delete from friend_requests
  where sender_id = p_sender_id
    and receiver_id = p_accept_id;

  -- Get accepter's username
  select username
  into accepter_username
  from users
  where user_id = p_accept_id;

  -- Add notification to original sender
  insert into notifications (user_id, title, description, type)
  values (
    p_sender_id,
    'Friend Request Accepted',
    format('You and %s are now friends!', accepter_username),
    'friend_request_accepted'
  );
end;
$$;