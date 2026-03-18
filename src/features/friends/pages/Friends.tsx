import { PageContainer, Tabs } from "@components";
import { Outlet } from "react-router-dom";
import FriendsDB from "@lib/db/friends";
import FriendRequestsDB from "@lib/db/friendRequests";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useMemo, useState } from "react";
import type { User } from "@models/tables";
import { tryCatch } from "@utils/tryCatch";
import { toast } from "@lib/toast";
import { type Friend, type Incoming } from "../types/stateTypes";
import { supabase } from "@lib/supabaseClient";

const routeNames = ["list", "incoming", "outgoing"];

const Friends = () => {
  const { user } = useAuth();
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [incomingRequests, setIncomingRequests] = useState<Incoming[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<User[]>([]);

  const combinedUserIds = useMemo(() => [
    ...friendsList.map(f => f.friend.user_id),
    ...incomingRequests.map(u => u.sender.user_id),
    ...outgoingRequests.map(u => u.user_id)
  ], [friendsList, incomingRequests, outgoingRequests]);

  const ignoredUsers = useMemo(() => incomingRequests
    .filter(r => r.ignored === true)
    .map(r => r.sender), [incomingRequests]);

  const getFriends = async () => {
    if (!user) return;
    const { data: friends, error } = await tryCatch(FriendsDB.getFriends(user.id));
    if (error) {
      toast.error("Could not get your friends, please try again later");
      return;
    };
    setFriendsList(friends);
  }

  const getRequests = async () => {
    if (!user) return;
    const { data: requests, error } = await tryCatch(FriendRequestsDB.getRequests(user.id));
    if (error) {
      toast.error("Could not get your friend requests, please try again later");
      return;
    };
    setIncomingRequests(requests.incoming);
    setOutgoingRequests(requests.outgoing);
  }

  useEffect(() => {
    getFriends();
    getRequests();
  }, [user]);

  useEffect(() => {
    const friendsChannel = supabase
      .channel('friends_updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'friends' },
        () => getFriends()
      )
      .subscribe();
    
    const requestsChannel = supabase
      .channel('friend_requests_updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'friend_requests' },
        () => getRequests()
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(friendsChannel);
      supabase.removeChannel(requestsChannel);
    }
  }, [user])
  return (
    <PageContainer title="Friends">
      <Tabs routes={routeNames}/>
      <div className="basic-container rounded-tl-none">
        <Outlet
          context={{
            friendsList,
            incomingRequests,
            outgoingRequests,
            user,
            combinedUserIds,
            ignoredUsers
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Friends;