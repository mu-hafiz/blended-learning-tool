import { Button, Avatar } from "@components";
import { useNavigate } from "react-router-dom";

type FriendIncomingProps = {
  username: string;
  profilePicture: string;
  accept: () => void;
  ignore: () => void;
}

const FriendIncomingItem = ({ username, profilePicture, accept, ignore }: FriendIncomingProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between cursor-pointer">
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
      <div className="flex flex-row gap-2">
        <Button
          variant="success"
          onClick={accept}
        >
          Accept
        </Button>
        <Button
          variant="danger"
          onClick={ignore}
        >
          Ignore
        </Button>
      </div>
    </div>
  );
};

export default FriendIncomingItem;