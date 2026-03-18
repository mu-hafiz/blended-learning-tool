create or replace function remove_friend(
  p_user_id_1 uuid,
  p_user_id_2 uuid
)
returns void
language plpgsql
security definer
as $$
begin
  -- Cannot send request to yourself
  if p_user_id_1 = p_user_id_2 then
    raise exception 'Both user IDs cannot be the same';
  end if;

  -- Remove friend request
  delete from friends
  where (user_id_1 = p_user_id_1 and user_id_2 = p_user_id_2)
    or (user_id_1 = p_user_id_2 and user_id_2 = p_user_id_1);
end;
$$;