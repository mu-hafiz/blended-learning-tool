import FriendItem from "@components/FriendItem";
import { useOutletContext } from "react-router-dom";
import type { ProfileOutletContext } from "../types/stateTypes";
import { MdPersonAddDisabled } from "react-icons/md";
import PrivatePlaceholder from "../components/PrivatePlaceholder";

const ProfileFriends = () => {
  const { friends, privacySettings, myProfile } = useOutletContext<ProfileOutletContext>();

  if (!myProfile && !privacySettings?.friends) {
    return <PrivatePlaceholder />;
  }

  return (
    <>
      <h2>Number of Friends: {friends?.length ?? 0}</h2>
      <hr className="divider" />
      {friends && friends.length > 0 ?
        (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {friends.map((friend) => (
              <FriendItem
                friend={friend.friend}
                date={friend.date}
                key={friend.friend.user_id}
              />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center gap-5">
            <MdPersonAddDisabled size={100}/>
            <h1>No one's around...</h1>
          </div>
        )
      }
    </>
  );
}

export default ProfileFriends;