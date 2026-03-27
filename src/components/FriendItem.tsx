import type { User } from "@models/tables";
import { Avatar } from "@components";
import { useNavigate } from "react-router-dom";

const FriendItem = ({ friend, date }: { friend: User, date: string }) => {
  const navigate = useNavigate();
  const dateObj = new Date(date);
  const friendDate = dateObj.toLocaleDateString("en-GB");
  return (
    <div
      className="flex items-center bg-surface-tertiary rounded-2xl h-20 raise cursor-pointer"
      onClick={() => navigate(`/profile/${friend.username}`)}
    >
      <Avatar
        filePath={friend.profile_picture}
        size={40}
        className="mx-4"
      />
      <div className="flex flex-col">
        <h3>{friend.username}</h3>
        <p className="subtitle">Friends since {friendDate}</p>
      </div>
    </div>
  );
};

export default FriendItem;