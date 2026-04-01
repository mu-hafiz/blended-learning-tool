import type { LeaderboardUser } from "../types/stateTypes";
import { Avatar } from "@components";
import { useNavigate } from "react-router-dom";

const defaultProfilePicture = "defaultProfilePicture.png";

const positionColours: Record<number, string> = {
  1: "bg-yellow-500",
  2: "bg-gray-400",
  3: "bg-amber-800",
  4: "bg-gray-600"
}

const LeaderboardItem = (
  { level, stat, username, position, myUsername, profilePicture, levelPrivacy }: LeaderboardUser
  & { position: number, myUsername: string | undefined }
) => {
  const navigate = useNavigate();
  const myEntry = username === myUsername;
  const positionColour = position >= 4 ? positionColours[4] : positionColours[position]

  return (
    <div
      className={`
        flex items-center bg-surface-tertiary rounded-2xl h-15 raise px-4 justify-between cursor-pointer
        ${myEntry ? "animate-pulse" : ""}
      `}
      onClick={() => navigate(`/profile/${username}`)}
    >
      <div className="flex flex-row items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${positionColour}`}>
          <h2>{position}</h2>
        </div>
        <Avatar
          filePath={profilePicture || defaultProfilePicture}
          size={40}
          className="mx-3"
        />
        <div className="flex flex-col">
          <h3>{username}</h3>
          {(levelPrivacy === "public" || myEntry) && <p>Level {level}</p>}
        </div>
      </div>
      <h2>{stat}</h2>
    </div>
  );
}

export default LeaderboardItem;