import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";
import { MdPersonAddDisabled } from "react-icons/md";
import FriendItem from "../components/FriendItem";

const FriendsList = () => {
  const { friendsList } = useOutletContext<FriendsOutletContext>();

  return (
    <>
      {friendsList.length > 0 ?
        (
          <ul className="grid grid-cols-4">
            {friendsList.map((friend) => (
              <FriendItem friend={friend.friend} date={friend.date} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full pb-15">
            <MdPersonAddDisabled size={100}/>
            <h1 className="mt-5">No notifications yet...</h1>
            <h2>Check back again later!</h2>
          </div>
        )
      }
    </>
  );
};

export default FriendsList;