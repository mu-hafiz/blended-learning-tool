import type { LeaderboardUser } from "../types/stateTypes";
import { Avatar } from "@components";
import { useNavigate } from "react-router-dom";
import { twMerge } from "tailwind-merge";

const defaultProfilePicture = "defaultProfilePicture.png";

const positionColours: Record<number, string> = {
  1: "bg-yellow-500 text-white",
  2: "bg-gray-400 text-white",
  3: "bg-amber-800 text-white",
  4: "bg-gray-600 text-white"
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
      className={twMerge(
        "flex items-center justify-between h-13 sm:h-15 px-4 bg-surface-tertiary rounded-2xl raise cursor-pointer shadow-lg",
        myEntry ? "animate-pulse" : ""
      )}
      onClick={() => navigate(`/profile/${username}`)}
    >
      <div className="flex flex-row items-center min-w-0">
        <div 
          className={twMerge(
            "flex items-center justify-center size-7 sm:size-8 rounded-full shrink-0",
            positionColour
          )}
        >
          <h2>{position}</h2>
        </div>
        <Avatar
          filePath={profilePicture || defaultProfilePicture}
          classNameSize="size-9 sm:size-10"
          className="mx-3 shrink-0"
        />
        <div className="flex flex-col min-w-0">
          <h3 className="truncate">{username}</h3>
          {(levelPrivacy === "public" || myEntry) && <p>Level {level}</p>}
        </div>
      </div>
      <h2 className="ml-3 shrink-0">{stat}</h2>
    </div>
  );
}

export default LeaderboardItem;