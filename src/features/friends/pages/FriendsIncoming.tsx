import { useOutletContext } from "react-router-dom";
import type { FriendsOutletContext } from "../types/stateTypes";

const FriendsIncoming = () => {
  const { incomingRequests } = useOutletContext<FriendsOutletContext>();

  return (
    <div>
      <p>Incoming Requests</p>
    </div>
  );
};

export default FriendsIncoming;