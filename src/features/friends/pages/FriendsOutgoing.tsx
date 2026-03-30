import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";
import { MdPersonAdd } from "react-icons/md";
import FriendOutgoingItem from "../components/FriendOutgoingItem";
import { useAuth } from "@providers/AuthProvider";
import { cancelRequest } from "@lib/friends";

const FriendsOutgoing = () => {
  const { user } = useAuth();
  const { outgoingRequests } = useOutletContext<FriendsOutletContext>();

  return (
    <>
      {outgoingRequests.length > 0 ?
        (
          <ul className="grid grid-cols-3 gap-4">
            {outgoingRequests.map((request) => (
              <FriendOutgoingItem
                username={request.username}
                cancel={() => cancelRequest(user, request.user_id, request.username)}
                key={request.user_id}
                profilePicture={request.profile_picture}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center pb-15">
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