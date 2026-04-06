import { Button, TextInput, Avatar } from "@components";
import { useEffect, useState } from "react";
import { useDebounce } from "@hooks/useDebounce";
import { tryCatch } from "@utils/tryCatch";
import { MdPersonAdd } from "react-icons/md";
import { ImSpinner6 } from "react-icons/im";
import { FaPersonCircleXmark } from "react-icons/fa6";
import UserDB from "@lib/db/users";
import { toast } from "@lib/toast";
import { FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import { addFriend } from "@lib/friends";

type UserQuery = {
  user_id: string;
  username: string;
  profile_picture: string;
}

type AddFriendProps = {
  onClose: () => void;
  userId: string | undefined;
  combinedUserIds: string[];
}

const AddFriendPopup = ({ onClose, userId, combinedUserIds }: AddFriendProps) => {
  const [username, setUsername] = useState("");
  const [users, setUsers] = useState<UserQuery[]>([]);
  const [queryDone, setQueryDone] = useState(false);
  const debouncedUsername = useDebounce(username);

  useEffect(() => {
    let cancelled = false;
    setQueryDone(false);

    const findUser = async () => {
      await new Promise(resolve => setTimeout(resolve, 10));
      if (cancelled) return;

      const { data, error } = await tryCatch(UserDB.findUser(debouncedUsername.value));
      if (error) {
        toast.error("There was an error finding users, please try again later");
        return;
      }
      if (cancelled) return;

      setUsers(data.filter(u => u.user_id !== userId));
      setQueryDone(true);
    }

    if (debouncedUsername.ready && debouncedUsername.value !== "") findUser();
    return () => { cancelled = true }
  }, [debouncedUsername.ready, debouncedUsername.value])

  return (
    <>
      <h2 className="text-center mb-3">Add Friend</h2>
      <TextInput
        title="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <hr className="divider mt-5"/>
      {username === "" && (
        <div className="h-full flex flex-col items-center justify-center">
          <MdPersonAdd size={80} />
          <h2 className="mt-3">Search for users by their username</h2>
        </div>
      )}
      {(username !== "" && (!debouncedUsername.ready || users === undefined)) && (
        <div className="h-full flex flex-col items-center justify-center">
          <ImSpinner6 size={80} />
          <h2 className="mt-3">Finding users...</h2>
        </div>
      )}
      {(queryDone && users?.length === 0) && (
        <div className="h-full flex flex-col items-center justify-center">
          <FaPersonCircleXmark size={80} />
          <h2 className="mt-3">No users found...</h2>
        </div>
      )}
      {(queryDone && users?.length > 0) && (
        <ul className="h-full gap-2 flex flex-col flex-1 overflow-auto">
          {users.filter(u => u.user_id !== userId).map(({user_id: receiverId, username, profile_picture: profilePicture}) => {
            return (
              <div
                className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between shadow-md"
                key={receiverId}
              >
                <Link
                  className="flex flex-row items-center gap-2 cursor-pointer"
                  to={`/profile/${username}`}
                >
                  <Avatar
                    filePath={profilePicture}
                    size={40}
                  />
                  <p>{username}</p>
                </Link>
                <Button
                  variant="success"
                  className="py-2"
                  onClick={() => {
                    onClose()
                    addFriend(userId, receiverId)
                  }}
                  disabled={combinedUserIds.includes(receiverId)}
                >
                  <FaPlus size={15} />
                </Button>
              </div>
            )
          })}
        </ul>
      )}
    </>
  );
}

export default AddFriendPopup;