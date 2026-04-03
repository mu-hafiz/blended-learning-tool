import AchievementItem from "@components/AchievementItem";
import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";
import { TbTrophy, TbTrophyOff } from "react-icons/tb";

const ProgressionAchievements = () => {
  const { unlockedAchievements, lockedAchievements } = useOutletContext<ProgressionOutletContext>();

  return (
    <>
      <h2>Unlocked</h2>
      <p className="subtitle">What have you accomplished?</p>
      <hr className="divider"/>
      {unlockedAchievements && unlockedAchievements.length > 0
        ?
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {unlockedAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                unlocked
                dateUnlocked={achievement.created_at}
                percentage={achievement.percentage}
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
      {lockedAchievements && lockedAchievements.length > 0
        ?
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {lockedAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                percentage={achievement.percentage}
              />
            ))}
          </div>
        :
          <div className="flex flex-col items-center justify-center gap-2">
            <TbTrophy size={100} />
            <h2>Wow, you've unlocked everything!</h2>
          </div>
      }
    </>
  );
};

export default ProgressionAchievements;