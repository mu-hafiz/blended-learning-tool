import type { LeaderboardUser } from "../types/stateTypes";

const positionColours: Record<number, string> = {
  1: "bg-yellow-500",
  2: "bg-gray-400",
  3: "bg-amber-800",
  4: "bg-gray-600"
}

const LeaderboardItem = (
  { level, stat, username, position, onClick, myUsername }: LeaderboardUser
  & { position: number, onClick: () => void, myUsername: string | undefined }
) => {
  const positionColour = position >= 4 ? positionColours[4] : positionColours[position]

  console.log(`Username: ${username}, My Username: ${myUsername}`)

  return (
    <div
      className={`
        flex items-center bg-surface-tertiary rounded-2xl h-15 raise p-5 justify-between cursor-pointer
        ${username === myUsername ? "animate-pulse" : ""}
      `}
      onClick={onClick}
    >
      <div className="flex flex-row items-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${positionColour}`}>
          <h2>{position}</h2>
        </div>
        <div className="bg-black rounded-full h-10 w-10 mx-4"/>
        <div className="flex flex-col">
          <h3>{username}</h3>
          <p>Level {level}</p>
        </div>
      </div>
      <h2>{stat}</h2>
    </div>
  );
}

export default LeaderboardItem;