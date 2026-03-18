import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";
import { MdPersonAddDisabled } from "react-icons/md";
import FriendItem from "../components/FriendItem";
import { Button, PopupContainer } from "@components";
import { useState } from "react";
import AddFriendPopup from "../components/AddFriendPopup";

const FriendsList = () => {
  const { friendsList, user, combinedUserIds } = useOutletContext<FriendsOutletContext>();
  const [showAddPopup, setShowAddPopup] = useState(false);

  return (
    <>
      <div className="flex justify-between">
        <Button
          variant="primary"
          onClick={() => setShowAddPopup(true)}
        >
          Add Friend
        </Button>
        <Button variant="danger">Remove Friend</Button>
      </div>
      <hr className="divider"/>
      {friendsList.length > 0 ?
        (
          <ul className="grid grid-cols-4">
            {friendsList.map((friend) => (
              <FriendItem
                friend={friend.friend}
                date={friend.date}
                key={friend.friend.user_id}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-15">
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
    </>
  );
};

export default FriendsList;