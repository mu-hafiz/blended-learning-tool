import AchievementItem from "@components/AchievementItem";
import { useOutletContext } from "react-router-dom";
import type { ProfileOutletContext } from "../types/stateTypes";
import { TbTrophyOff } from "react-icons/tb";
import { FaLock } from "react-icons/fa";

const ProfileAchievements = () => {
  const { achievements, privacySettings, myProfile } = useOutletContext<ProfileOutletContext>();

  if (!myProfile && !privacySettings?.achievements) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FaLock size={100} className="mb-5"/>
        <h1>Private</h1>
        <h2>You are not permitted to view...</h2>
      </div>
    );
  }

  const header = (
    <>
      <h2>Number of Unlocked Achievements: {achievements?.length ?? 0}</h2>
      <hr className="divider" />
    </>
  );

  if (achievements && achievements.length > 0) {
    return (
      <>
        {header}
        <div className="grid grid-cols-4 gap-4">
          {achievements?.map(achievement => (
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
      </>
    );
  }

  return (
    <>
      {header}
      <div className="flex flex-col items-center justify-center h-full gap-5">
        <TbTrophyOff size={100} />
        <h1>No achievements yet...</h1>
      </div>
    </>
  );
}

export default ProfileAchievements;