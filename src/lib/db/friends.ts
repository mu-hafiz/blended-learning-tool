import { supabase } from "@lib/supabaseClient";
import FriendRequestsDB from "./friendRequests";

async function getFriends(userId: string) {
  const { data, error } = await supabase.from('friends')
    .select(`
      created_at,
      user1:users!friends_user_id_1_fkey(*),
      user2:users!friends_user_id_2_fkey(*)
    `)
    .or(`user_id_1.eq.${userId}, user_id_2.eq.${userId}`);
  
  if (error) {
    console.log("Error getting friends: ", error);
    throw new Error("Error getting friends: ", error);
  }

  return data.map(pair => pair.user1.user_id === userId
    ? { friend: pair.user2, date: pair.created_at }
    : { friend: pair.user1, date: pair.created_at });
};

async function checkFriendStatus(userId: string, friendId: string):
  Promise<"friends" | "request_received" | "request_sent" | "not_friends"> 
{
  const { data: friendData, error: friendError } = await supabase.from('friends')
    .select('*')
    .or(`and(user_id_1.eq.${userId},user_id_2.eq.${friendId}),and(user_id_1.eq.${friendId},user_id_2.eq.${userId})`)
    .maybeSingle();
  
  if (friendError) {
    console.log("Error checking friend: ", friendError);
    throw new Error("Error checking friend: ", friendError);
  }

  if (friendData !== null) return "friends";

  const { incoming, outgoing } = await FriendRequestsDB.getRequests(userId);

  if (incoming.filter(i => i.sender.user_id === friendId).length === 1) {
    return "request_received"
  }

  if (outgoing.filter(o => o.user_id === friendId).length === 1) {
    return "request_sent"
  }

  return "not_friends"
}

export default { getFriends, checkFriendStatus };