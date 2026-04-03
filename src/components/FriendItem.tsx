import type { User } from "@models/tables";
import { Avatar } from "@components";
import { Link } from "react-router-dom";

const FriendItem = ({ friend, date }: { friend: User, date: string }) => {
  const dateObj = new Date(date);
  const friendDate = dateObj.toLocaleDateString("en-GB");
  return (
    <Link
      className="flex h-15 sm:h-17 px-3 items-center bg-surface-tertiary rounded-2xl raise cursor-pointer"
      to={`/profile/${friend.username}`}
    >
      <Avatar
        filePath={friend.profile_picture}
        size={40}
      />
      <div className="flex flex-col min-w-0 ml-3">
        <h3 className="truncate">{friend.username}</h3>
        <p className="subtitle">Friends since {friendDate}</p>
      </div>
    </Link>
  );
};

export default FriendItem;