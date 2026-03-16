import { supabase } from "@lib/supabaseClient";

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

export default { getFriends };