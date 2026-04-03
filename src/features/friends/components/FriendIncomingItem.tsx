import { Button, Avatar } from "@components";
import { Link } from "react-router-dom";

type FriendIncomingProps = {
  username: string;
  profilePicture: string;
  accept: () => void;
  ignore: () => void;
}

const FriendIncomingItem = ({ username, profilePicture, accept, ignore }: FriendIncomingProps) => (
  <div className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between">
    <Link
      className="flex flex-row items-center min-w-0 gap-2 cursor-pointer"
      to={`/profile/${username}`}
    >
      <Avatar
        filePath={profilePicture}
        size={40}
      />
      <h3 className="truncate">{username}</h3>
    </Link>
    <div className="flex flex-row gap-2 shrink-0 ml-3">
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

export default FriendIncomingItem;