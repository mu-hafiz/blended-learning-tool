import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";
import { MdPersonAdd } from "react-icons/md";
import FriendOutgoingItem from "../components/FriendOutgoingItem";
import { toast } from "@lib/toast";
import { supabase } from "@lib/supabaseClient";

const FriendsOutgoing = () => {
  const { outgoingRequests, user } = useOutletContext<FriendsOutletContext>();

  const cancelRequest = async (receiverId: string, receiverUsername: string) => {
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

  return (
    <>
      {outgoingRequests.length > 0 ?
        (
          <ul className="grid grid-cols-3">
            {outgoingRequests.map((request) => (
              <FriendOutgoingItem
                username={request.username}
                cancel={() => cancelRequest(request.user_id, request.username)}
                key={request.user_id}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-15">
            <MdPersonAdd size={100}/>
            <h1 className="mt-5">No requests sent.</h1>
            <h2>Start building your community!</h2>
          </div>
        )
      }
    </>
  );
};

export default FriendsOutgoing;