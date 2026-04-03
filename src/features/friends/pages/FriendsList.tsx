import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";
import { MdPersonAddDisabled } from "react-icons/md";
import FriendItem from "@components/FriendItem";
import { Button, PopupContainer } from "@components";
import { useState } from "react";
import AddFriendPopup from "../components/AddFriendPopup";
import RemoveFriendPopup from "../components/RemoveFriendPopup";
import { useAuth } from "@providers/AuthProvider";

const FriendsList = () => {
  const { user } = useAuth();
  const { friendsList, combinedUserIds } = useOutletContext<FriendsOutletContext>();
  const [showAddPopup, setShowAddPopup] = useState(false);
  const [showRemovePopup, setShowRemovePopup] = useState(false);

  return (
    <>
      <div className="flex justify-between">
        <Button
          variant="primary"
          onClick={() => setShowAddPopup(true)}
        >
          Add Friend
        </Button>
        <Button
          variant="danger"
          onClick={() => setShowRemovePopup(true)}
        >
          Remove Friend
        </Button>
      </div>
      <hr className="divider"/>
      {friendsList.length > 0 ?
        (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {friendsList.map((friend) => (
              <FriendItem
                friend={friend.friend}
                date={friend.date}
                key={friend.friend.user_id}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center">
            <MdPersonAddDisabled size={100}/>
            <h1 className="mt-5">No one's around...</h1>
            <h2>Get out there and make some friends!</h2>
          </div>
        )
      }
      <PopupContainer
        open={showAddPopup}
        onClose={() => setShowAddPopup(false)}
      >
        <AddFriendPopup
          onClose={() => setShowAddPopup(false)}
          userId={user?.id}
          combinedUserIds={combinedUserIds}
        />
      </PopupContainer>
      <PopupContainer
        open={showRemovePopup}
        onClose={() => setShowRemovePopup(false)}
      >
        <RemoveFriendPopup
          onClose={() => setShowRemovePopup(false)}
          userId={user?.id}
          friendsList={friendsList}
        />
      </PopupContainer>
    </>
  );
};

export default FriendsList;