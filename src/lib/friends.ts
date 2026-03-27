import { toast } from "./toast";
import { supabase } from "./supabaseClient";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import RequestsDB from "./db/friendRequests";
import { tryCatch } from "@utils/tryCatch";

const addFriend = async (senderId: string | undefined, receiverId: string) => {
  const toastId = toast.loading(`Sending request...`);

  if (!senderId) {
    toast.error("Could not get your user information, please try again later", { id: toastId });
    console.error("This user's ID is undefined");
    return;
  }

  const { error } = await supabase.rpc('add_friend_request', {
    p_sender_id: senderId,
    p_receiver_id: receiverId
  });
  if (error) {
    toast.error("Could not send request, please try again later", { id: toastId });
    console.error(error.message);
    return;
  }

  toast.success("Request sent!", { id: toastId });
};

const removeFriend = async (userId: string | undefined, friendId: string, friendUsername: string) => {
  const toastId = toast.loading(`Sending ${friendUsername} a request...`);

  if (!userId) {
    toast.error("Could not get your user information, please try again later", { id: toastId });
    console.error("This user's ID is undefined");
    return;
  }

  const { error } = await supabase.rpc('remove_friend', {
    p_user_id_1: userId,
    p_user_id_2: friendId
  });
  if (error) {
    toast.error("Could not remove friend, please try again later", { id: toastId });
    console.error(error.message);
    return;
  }

  toast.success(`Removed ${friendUsername} from your friends`, { id: toastId });
}

const acceptRequest = async (user: SupabaseUser | null | undefined, senderId: string, senderUsername: string) => {
  const toastId = toast.loading("Accepting request...");
  if (!user?.id) {
    toast.error("Could not get your information, please try again later", { id: toastId });
    console.error("User ID is undefined");
    return;
  }

  const { error } = await supabase.rpc('accept_friend_request', {
    p_accept_id: user.id,
    p_sender_id: senderId
  });
  if (error) {
    toast.error("Could not send request, please try again later", { id: toastId });
    console.error(error.message);
    return;
  }

  toast.success(`You and ${senderUsername} are now friends!`, { id: toastId });
}

const ignoreRequest = async (user: SupabaseUser | null | undefined, senderId: string) => {
  const toastId = toast.loading("Ignoring request...");
  if (!user?.id) {
    toast.error("Could not get your information, please try again later", { id: toastId });
    console.error("User ID is undefined");
    return;
  }

  const { error } = await tryCatch(RequestsDB.ignoreRequest(senderId, user.id));
  if (error) {
    toast.error("Could not ignore friend request, please try again later", { id: toastId });
    return;
  };

  toast.info("Friend request ignored", { id: toastId })
}

const cancelRequest = async (user: SupabaseUser | null | undefined, receiverId: string, receiverUsername: string) => {
  const toastId = toast.loading("Accepting request...");
  if (!user?.id) {
    toast.error("Could not get your information, please try again later", { id: toastId });
    console.error("User ID is undefined");
    return;
  }

  const { error } = await supabase.rpc('remove_friend_request', {
    p_sender_id: user.id,
    p_receiver_id: receiverId
  });
  if (error) {
    toast.error("Could not send request, please try again later", { id: toastId });
    console.error(error.message);
    return;
  }

  toast.info(`Friend request to ${receiverUsername} cancelled`, { id: toastId });
}

export {
  addFriend,
  removeFriend,
  acceptRequest,
  ignoreRequest,
  cancelRequest
};