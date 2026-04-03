import AchievementItem from "@components/AchievementItem";
import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";
import { TbTrophy, TbTrophyOff } from "react-icons/tb";

const ProgressionAchievements = () => {
  const { unlockedAchievements, lockedAchievements } = useOutletContext<ProgressionOutletContext>();
  const lockedFlashcardAchievements = lockedAchievements?.filter(a => a.unlock_type.includes("flashcard"));
  const lockedFriendAchievements = lockedAchievements?.filter(a => a.unlock_type.includes("friend"));
  const lockedLikeAchievements = lockedAchievements?.filter(a => a.unlock_type.includes("like"));

  return (
    <>
      <h2>Unlocked</h2>
      <p className="subtitle">What have you accomplished?</p>
      <hr className="divider"/>
      {unlockedAchievements && unlockedAchievements.length > 0
        ?
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {unlockedAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                unlocked
                dateUnlocked={achievement.created_at}
                percentage={achievement.percentage}
                type={achievement.unlock_type}
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
      {/* {lockedAchievements && lockedAchievements.length > 0
        ?
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {lockedAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                percentage={achievement.percentage}
                type={achievement.unlock_type}
              />
            ))}
          </div>
        :
          <div className="flex flex-col items-center justify-center gap-2">
            <TbTrophy size={100} />
            <h2>Wow, you've unlocked everything!</h2>
          </div>
      } */}
      {lockedFlashcardAchievements && lockedFlashcardAchievements.length > 0 && (
        <>
          <h2 className="mb-3">Flashcards:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {lockedFlashcardAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                percentage={achievement.percentage}
                type={achievement.unlock_type}
              />
            ))}
          </div>
        </>
      )}
      {lockedFriendAchievements && lockedFriendAchievements.length > 0 && (
        <>
          <h2 className="mb-3">Friends:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {lockedFriendAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                percentage={achievement.percentage}
                type={achievement.unlock_type}
              />
            ))}
          </div>
        </>
      )}
      {lockedLikeAchievements && lockedLikeAchievements.length > 0 && (
        <>
          <h2 className="mb-3">Likes:</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {lockedLikeAchievements.map(achievement => (
              <AchievementItem
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                xp={achievement.xp}
                percentage={achievement.percentage}
                type={achievement.unlock_type}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default ProgressionAchievements;