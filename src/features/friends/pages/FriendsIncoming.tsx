import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";
import { HiInboxArrowDown } from "react-icons/hi2";
import FriendIncomingItem from "../components/FriendIncomingItem";
import { supabase } from "@lib/supabaseClient";
import { toast } from "@lib/toast";
import { Button, PopupContainer } from "@components";
import { useState } from "react";
import { tryCatch } from "@utils/tryCatch";
import RequestsDB from "@lib/db/friendRequests";
import IgnoredRequestsPopup from "../components/IgnoredRequestsPopup";

const FriendsIncoming = () => {
  const { incomingRequests, user, ignoredUsers } = useOutletContext<FriendsOutletContext>();
  const [showIgnoredPopup, setShowIgnoredPopup] = useState(false);

  const acceptRequest = async (senderId: string, senderUsername: string) => {
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

  const ignoreRequest = async (senderId: string) => {
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

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowIgnoredPopup(true)}
      >
        Ignored Requests
      </Button>
      <hr className="divider"/>
      {incomingRequests.length > 0 ?
        (
          <ul className="grid grid-cols-3">
            {incomingRequests.filter(r => r.ignored !== true).map(({ sender }) => (
              <FriendIncomingItem
                username={sender.username}
                accept={() => acceptRequest(sender.user_id, sender.username)}
                ignore={() => ignoreRequest(sender.user_id)}
                key={sender.user_id}
                profilePicture={sender.profile_picture}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-15">
            <HiInboxArrowDown size={100}/>
            <h1 className="mt-5">No requests received.</h1>
            <h2>All cleaned up!</h2>
          </div>
        )
      }
      <PopupContainer
        open={showIgnoredPopup}
        onClose={() => setShowIgnoredPopup(false)}
      >
        <IgnoredRequestsPopup
          onClose={() => setShowIgnoredPopup(false)}
          userId={user?.id}
          ignoredUsers={ignoredUsers}
        />
      </PopupContainer>
    </>
  );
};

export default FriendsIncoming;