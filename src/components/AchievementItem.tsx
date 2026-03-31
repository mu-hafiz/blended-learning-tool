import { FaTrophy } from "react-icons/fa";
import Tooltip from "./Tooltip";
import formatDate from "@features/flashcards/utils/formatDate";

type AchievementProps = {
  title: string,
  description: string,
  xp: number,
  unlocked?: false
} | {
  title: string,
  description: string,
  xp: number,
  unlocked: true,
  dateUnlocked: string,
}

const AchievementItem = (props: AchievementProps) => {
  const { title, description, xp, unlocked } = props;
  let date = "";
  if (unlocked) {
    date = formatDate(props.dateUnlocked);
  }
  
  return (
    <Tooltip
      position="top"
      text={`Unlocked on: ${date}`}
      disabled={!unlocked}
    >
      <div className="h-20 bg-surface-tertiary rounded-xl flex items-center p-5 raise">
        <FaTrophy
          size={40}
          className={unlocked
            ? "text-yellow-400 animate-pulse"
            : "text-gray-400"
          }
        />
        <div className="ml-3 flex flex-col">
          <h3>{title}</h3>
          <p className="subtitle">{description}</p>
        </div>
        {!unlocked && <h3>+{xp}XP</h3>}
      </div>
    </Tooltip>
  )
};

export default AchievementItem;