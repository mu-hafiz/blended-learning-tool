import { Button, Avatar } from "@components";
import { Link } from "react-router-dom";

type FriendOutgoingProps = {
  username: string;
  profilePicture: string;
  cancel: () => void;
}

const FriendOutgoingItem = ({ username, profilePicture, cancel }: FriendOutgoingProps) => (
  <div className="flex flex-row w-full bg-surface-secondary rounded-xl p-3 items-center justify-between">
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
      variant="danger"
      onClick={cancel}
    >
      Cancel
    </Button>
  </div>
);

export default FriendOutgoingItem;