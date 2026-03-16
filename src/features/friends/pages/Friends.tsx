import { PageContainer, Tabs } from "@components";
import { Outlet } from "react-router-dom";
import FriendsDB from "@lib/db/friends";
import FriendRequestsDB from "@lib/db/friendRequests";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import type { User } from "@models/tables";
import { tryCatch } from "@utils/tryCatch";
import { toast } from "@lib/toast";
import { type Friend } from "../types/stateTypes";

const routeNames = ["list", "incoming", "outgoing"];

const Friends = () => {
  const { user } = useAuth();
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<User[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<User[]>([]);

  useEffect(() => {
    if (!user) return;

    const getFriends = async () => {
      const { data: friends, error } = await tryCatch(FriendsDB.getFriends(user.id));
      if (error) {
        toast.error("Could not get your friends, please try again later");
        return;
      };
      setFriendsList(friends);
    }

    const getRequests = async () => {
      const { data: requests, error } = await tryCatch(FriendRequestsDB.getRequests(user.id));
      if (error) {
        toast.error("Could not get your friend requests, please try again later");
        return;
      };
      setIncomingRequests(requests.incoming);
      setOutgoingRequests(requests.outgoing);
    }

    getFriends();
    getRequests();

  }, [user]);

  return (
    <PageContainer title="Friends">
      <Tabs routes={routeNames}/>
      <div className="basic-container rounded-tl-none">
        <Outlet
          context={{
            friendsList,
            incomingRequests,
            outgoingRequests
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Friends;