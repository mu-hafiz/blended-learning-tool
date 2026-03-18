import { supabase } from "@lib/supabaseClient";

async function getRequests(userId: string) {
  const { data, error } = await supabase.from('friend_requests')
    .select(`
      sender:users!friend_requests_sender_id_fkey(*),
      receiver:users!friend_requests_receiver_id_fkey(*),
      ignored
    `)
    .or(`sender_id.eq.${userId}, receiver_id.eq.${userId}`);
  
  if (error) {
    console.log("Error getting friends: ", error);
    throw new Error("Error getting friends: ", error);
  }

  const incoming = data
    .filter(request => request.receiver.user_id === userId)
    .map(request => ({
      sender: request.sender,
      ignored: request.ignored
    }))
  const outgoing = data
    .filter(request => request.sender.user_id === userId)
    .map(request => request.receiver)

  return { incoming, outgoing };
};

async function ignoreRequest(senderId: string, receiverId: string, ignored: boolean = true) {
  const { error } = await supabase.from('friend_requests')
    .update({ ignored })
    .eq('sender_id', senderId)
    .eq('receiver_id', receiverId);
  
  if (error) {
    console.log("Error ignoring friend request: ", error);
    throw new Error("Error ignoring friend request: ", error);
  }
}

export default { getRequests, ignoreRequest };