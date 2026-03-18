import { MdPersonAddDisabled } from "react-icons/md";
import type { Friend } from "../types/stateTypes";
import { Button } from "@components";
import { toast } from "@lib/toast";
import { supabase } from "@lib/supabaseClient";

type RemoveFriendProps = {
  onClose: () => void;
  userId: string | undefined;
  friendsList: Friend[];
}

const RemoveFriendPopup = ({ onClose, userId, friendsList }: RemoveFriendProps) => {

  const removeFriend = async (userId: string | undefined, friendId: string, friendUsername: string) => {
    onClose();
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
                  <div className="bg-black rounded-full h-10 w-10"/>
                  <p>{friend.username}</p>
                </div>
                <Button
                  variant="danger"
                  onClick={() => removeFriend(userId, friend.user_id, friend.username)}
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