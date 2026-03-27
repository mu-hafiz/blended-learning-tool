import AchievementItem from "@components/AchievementItem";
import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";
import { TbTrophyOff } from "react-icons/tb";

const ProgressionAchievements = () => {
  const { unlockedAchievements, lockedAchievements } = useOutletContext<ProgressionOutletContext>();

  return (
    <>
      <h2>Unlocked</h2>
      <p className="subtitle">What have you accomplished?</p>
      <hr className="divider"/>
      {unlockedAchievements && unlockedAchievements.length > 0
        ?
          <div className="grid grid-cols-4 gap-4">
            {unlockedAchievements?.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                unlocked
                dateUnlocked={achievement.created_at}
              />
            ))}
          </div>
        : 
          <div className="flex flex-col items-center justify-center gap-2">
            <TbTrophyOff size={100} />
            <h2>Start earning!</h2>
          </div>
      }
      

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