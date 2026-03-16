import type { User } from "@models/tables";

const FriendItem = ({ friend, date }: { friend: User, date: string }) => {
  const dateObj = new Date(date);
  const friendDate = dateObj.toLocaleDateString("en-GB");
  return (
    <div className="flex items-center bg-surface-tertiary rounded-2xl h-20">
      <div className="bg-black rounded-full h-10 w-10 mx-4"/>
      <div className="flex flex-col">
        <p>{friend.username}</p>
        <p className="subtitle">Friends since {friendDate}</p>
      </div>
    </div>
  );
};

export default FriendItem;