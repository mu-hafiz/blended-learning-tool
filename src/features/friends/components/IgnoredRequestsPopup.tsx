import { tryCatch } from "@utils/tryCatch";
import RequestsDB from "@lib/db/friendRequests";
import { toast } from "@lib/toast";
import { type User } from "@models/tables";
import { Button } from "@components";

type IgnoredRequestsProps = {
  onClose: () => void;
  userId: string | undefined;
  ignoredUsers: User[];
}

const IgnoredRequestsPopup = ({ onClose, userId, ignoredUsers }: IgnoredRequestsProps) => {

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
      <ul className="mt-4 gap-2 flex flex-col flex-1 overflow-auto">
        {ignoredUsers.map(({user_id: senderId, username}) => {
          return (
            <div
              className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between"
              key={senderId}
            >
              <div className="flex flex-row items-center gap-2">
                <div className="bg-black rounded-full h-10 w-10"/>
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
    </div>
  );
};

export default IgnoredRequestsPopup