import { Button, Avatar } from "@components";
import { useNavigate } from "react-router-dom";

type FriendOutgoingProps = {
  username: string;
  profilePicture: string;
  cancel: () => void;
}

const FriendOutgoingItem = ({ username, profilePicture, cancel }: FriendOutgoingProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between">
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
        variant="danger"
        onClick={cancel}
      >
        Cancel
      </Button>
    </div>
  );
};

export default FriendOutgoingItem;