import FriendItem from "@components/FriendItem";
import { useOutletContext } from "react-router-dom";
import type { ProfileOutletContext } from "../types/stateTypes";
import { MdPersonAddDisabled } from "react-icons/md";
import { FaLock } from "react-icons/fa";

const ProfileFriends = () => {
  const { friends, privacySettings, myProfile } = useOutletContext<ProfileOutletContext>();

  if (!myProfile && !privacySettings?.friends) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FaLock size={100} className="mb-5"/>
        <h1>Private</h1>
        <h2>You are not permitted to view...</h2>
      </div>
    );
  }

  return (
    <>
      <h2>Number of Friends: {friends?.length ?? 0}</h2>
      <hr className="divider" />
      {friends && friends.length > 0 ?
        (
          <ul className="grid grid-cols-4 gap-4">
            {friends.map((friend) => (
              <FriendItem
                friend={friend.friend}
                date={friend.date}
                key={friend.friend.user_id}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-5">
            <MdPersonAddDisabled size={100}/>
            <h1>No one's around...</h1>
          </div>
        )
      }
    </>
  );
}

export default ProfileFriends;