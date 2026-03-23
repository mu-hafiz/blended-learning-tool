import { FaTrophy } from "react-icons/fa";

type AchievementProps = {
  title: string,
  description: string,
  xp: number,
  unlocked?: boolean
}

const AchievementItem = ({title, description, xp, unlocked = false}: AchievementProps) => {
  return (
    <div className="h-25 bg-surface-tertiary rounded-xl flex items-center p-5">
      <FaTrophy
        size={40}
        className={unlocked
          ? "text-yellow-400 animate-pulse"
          : "text-gray-400"
        }
      />
      <div className="ml-3 flex flex-col gap-1">
        <h3>{title}</h3>
        <p className="subtitle" title="This is a test">{description}</p>
      </div>
      {!unlocked && <h3>+{xp}XP</h3>}
    </div>
  )
};

export default AchievementItem;