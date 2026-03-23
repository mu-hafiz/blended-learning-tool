import AchievementItem from "../components/AchievementItem";
import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";

const ProgressionAchievements = () => {
  const { unlockedAchievements, lockedAchievements } = useOutletContext<ProgressionOutletContext>();

  return (
    <>
      <h2>Unlocked</h2>
      <p className="subtitle">What have you accomplished?</p>
      <hr className="divider"/>
      <div className="grid grid-cols-4 gap-4">
        {unlockedAchievements?.map(achievement => (
          <AchievementItem
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            xp={achievement.xp}
            unlocked
          />
        ))}
      </div>

      <h2 className="mt-5">Locked</h2>
      <p className="subtitle">What will you unlock next?</p>
      <hr className="divider"/>
      <div className="grid grid-cols-4 gap-4">
        {lockedAchievements?.map(achievement => (
          <AchievementItem
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            xp={achievement.xp}
          />
        ))}
      </div>
    </>
  );
};

export default ProgressionAchievements;