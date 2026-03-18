alter table "public"."friend_requests" add column "ignored" boolean not null default false;

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.accept_friend_request(p_accept_id uuid, p_sender_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.add_friend_request(p_sender_id uuid, p_receiver_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;

CREATE OR REPLACE FUNCTION public.remove_friend_request(p_sender_id uuid, p_receiver_id uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
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
$function$
;


  create policy "Users can update friend requests they are involved in"
  on "public"."friend_requests"
  as permissive
  for update
  to authenticated
using (((( SELECT auth.uid() AS uid) = sender_id) OR (( SELECT auth.uid() AS uid) = receiver_id)))
with check (((( SELECT auth.uid() AS uid) = sender_id) OR (( SELECT auth.uid() AS uid) = receiver_id)));



