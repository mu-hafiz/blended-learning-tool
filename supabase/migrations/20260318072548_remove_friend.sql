set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.remove_friend(p_user_id_1 uuid, p_user_id_2 uuid)
 RETURNS void
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$begin
  if p_user_id_1 = p_user_id_2 then
    raise exception 'Both user IDs cannot be the same';
  end if;
  
  delete from friends
  where (user_id_1 = p_user_id_1 and user_id_2 = p_user_id_2)
    or (user_id_1 = p_user_id_2 and user_id_2 = p_user_id_1);
end;$function$
;

alter publication supabase_realtime add table friend_requests;
alter publication supabase_realtime add table friends;