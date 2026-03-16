import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";

const FriendsOutgoing = () => {
  const { outgoingRequests } = useOutletContext<FriendsOutletContext>();

  return (
    <div>
      <p>Outgoing Requests</p>
    </div>
  );
};

export default FriendsOutgoing;