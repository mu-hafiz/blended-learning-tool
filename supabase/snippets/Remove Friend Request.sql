create or replace function remove_friend_request(
  p_sender_id uuid,
  p_receiver_id uuid
)
returns void
language plpgsql
security definer
as $$
begin
  -- Cannot send request to yourself
  if p_sender_id = p_receiver_id then
    raise exception 'Both user IDs cannot be the same';
  end if;

  -- Remove friend request
  delete from friend_requests
  where sender_id = p_sender_id
    and receiver_id = p_receiver_id;
end;
$$;