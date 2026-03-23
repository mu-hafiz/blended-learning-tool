import { tryCatch } from "@utils/tryCatch";
import RequestsDB from "@lib/db/friendRequests";
import { toast } from "@lib/toast";
import { type User } from "@models/tables";
import { Button, Avatar } from "@components";
import { HiInboxArrowDown } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

type IgnoredRequestsProps = {
  onClose: () => void;
  userId: string | undefined;
  ignoredUsers: User[];
}

const IgnoredRequestsPopup = ({ onClose, userId, ignoredUsers }: IgnoredRequestsProps) => {
  const navigate = useNavigate();

  const stopIgnoring = async (senderId: string, receiverId: string | undefined) => {
    onClose();
    const toastId = toast.loading("Removing request from ignored...");

    if (!receiverId) {
      toast.error("Could not get your user information, please try again later", { id: toastId });
      console.error("This user's ID is undefined");
      return;
    }

    const { error } = await tryCatch(RequestsDB.ignoreRequest(senderId, receiverId, false));
    if (error) {
      toast.error("Could not remove from ignored requests, please try again later", { id: toastId });
      return;
    };

    toast.success("Removed from ignored requests!", { id: toastId });
  };

  return (
    <div className="w-100 h-100 flex flex-col">
      <h2 className="text-center mb-3">Ignored Friend Requests</h2>
      <hr className="divider mt-5"/>
      {ignoredUsers.length === 0 ? (
        <div className="h-full flex flex-col items-center justify-center">
          <HiInboxArrowDown size={100}/>
          <h2 className="mt-3">No ignored requests here...</h2>
        </div>
      ) : (
        <ul className="mt-4 gap-2 flex flex-col flex-1 overflow-auto">
          {ignoredUsers.map(({user_id: senderId, username, profile_picture: profilePicture}) => {
            return (
              <div
                className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between cursor-pointer"
                key={senderId}
              >
                <div
                  className="flex flex-row items-center gap-2 cursor-pointer"
                  onClick={() => navigate(`/profile/${username}`)}
                >
                  <Avatar
                    filePath={profilePicture}
                    size={40}
                  />
                  <p>{username}</p>
                </div>
                <Button
                  variant="primary"
                  onClick={() => stopIgnoring(senderId, userId)}
                >
                  Remove from ignored
                </Button>
              </div>
            )
          })}
        </ul>
      )}
    </div>
  );
};

export default IgnoredRequestsPopup