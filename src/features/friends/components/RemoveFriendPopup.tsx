import { MdPersonAddDisabled } from "react-icons/md";
import type { Friend } from "../types/stateTypes";
import { Button, Avatar } from "@components";
import { removeFriend } from "@lib/friends";

type RemoveFriendProps = {
  onClose: () => void;
  userId: string | undefined;
  friendsList: Friend[];
}

const RemoveFriendPopup = ({ onClose, userId, friendsList }: RemoveFriendProps) => {
  return (
    <div className="w-100 h-100 flex flex-col">
      <h2 className="text-center mb-3">Remove Friend</h2>
      <hr className="divider mt-5"/>
      {friendsList.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <MdPersonAddDisabled size={100}/>
          <h2 className="mt-3">No friends to remove...</h2>
        </div>
      ) : (
        <ul className="mt-4 gap-2 flex flex-col flex-1 overflow-auto">
          {friendsList.map(({ friend }) => {
            return (
              <div
                className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between"
                key={friend.user_id}
              >
                <div className="flex flex-row items-center gap-2">
                  <Avatar
                    filePath={friend.profile_picture}
                    size={40}
                  />
                  <p>{friend.username}</p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => {
                    onClose()
                    removeFriend(userId, friend.user_id, friend.username)
                  }}
                >
                  Remove
                </Button>
              </div>
            )
          })}
        </ul>
      )}
    </div>
  )
};

export default RemoveFriendPopup;