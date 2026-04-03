import { FaTrophy } from "react-icons/fa";
import Tooltip from "./Tooltip";
import formatDate from "@features/flashcards/utils/formatDate";
import { twMerge } from "tailwind-merge";

type AchievementProps = {
  title: string,
  description: string,
  xp: number,
  unlocked?: false
  percentage: string,
} | {
  title: string,
  description: string,
  xp: number,
  unlocked: true,
  dateUnlocked: string,
  percentage: string,
}

const AchievementItem = (props: AchievementProps) => {
  const { title, description, xp, unlocked, percentage } = props;
  let date = "";
  if (unlocked) {
    date = formatDate(props.dateUnlocked);
  }
  
  return (
    <Tooltip
      position="top"
      text={unlocked ? `Unlocked on: ${date}` : description}
    >
      <div className="flex items-center justify-between h-22 sm:h-25 p-3 px-4 bg-surface-tertiary rounded-xl raise">
        <div className="flex flex-row items-center min-w-0">
          <FaTrophy
            className={twMerge(
              "size-8 md:size-10 shrink-0",
              unlocked
              ? "text-yellow-400 animate-pulse"
              : "text-gray-400"
            )}
          />
          <div className="ml-3 flex flex-col min-w-0">
            <h3 className="truncate">{title}</h3>
            <p className="line-clamp-2">{description}</p>
            <p className="subtitle">Unlocked by {percentage}% of users</p>
          </div>
        </div>
        {!unlocked && <h3 className="ml-3 shrink-0">+{xp}XP</h3>}
      </div>
    </Tooltip>
  )
};

export default AchievementItem;