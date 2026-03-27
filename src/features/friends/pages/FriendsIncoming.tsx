import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";
import { HiInboxArrowDown } from "react-icons/hi2";
import FriendIncomingItem from "../components/FriendIncomingItem";
import { Button, PopupContainer } from "@components";
import { useState } from "react";
import IgnoredRequestsPopup from "../components/IgnoredRequestsPopup";
import { acceptRequest, ignoreRequest } from "@lib/friends";
import { useAuth } from "@providers/AuthProvider";

const FriendsIncoming = () => {
  const { user } = useAuth();
  const { incomingRequests, ignoredUsers } = useOutletContext<FriendsOutletContext>();
  const [showIgnoredPopup, setShowIgnoredPopup] = useState(false);

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
          <ul className="grid grid-cols-3 gap-4">
            {incomingRequests.filter(r => r.ignored !== true).map(({ sender }) => (
              <FriendIncomingItem
                username={sender.username}
                accept={() => acceptRequest(user, sender.user_id, sender.username)}
                ignore={() => ignoreRequest(user, sender.user_id)}
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