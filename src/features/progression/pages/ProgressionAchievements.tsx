import { useEffect, useState } from "react";
import AchievementItem from "../components/AchievementItem";
import AchievementsDB from "@lib/db/achievements";
import UnlockedAchievementsDB from "@lib/db/unlockedAchievements";
import type { Achievement } from "@models/tables";
import { useAuth } from "@providers/AuthProvider";

const ProgressionAchievements = () => {
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[]>([]);
  const { user } = useAuth();
  
  useEffect(() => {
    if (!user) return;

    const getAchievements = async () => {
      const achievements = await AchievementsDB.getAchievements();
      const unlockedAchievements = await UnlockedAchievementsDB.getUnlockedAchievements(user.id);
      const unlockedIds = unlockedAchievements.map(achievement => achievement.id);
      const lockedAchievements = achievements.filter(achievement => !unlockedIds.includes(achievement.id));
      setUnlockedAchievements(unlockedAchievements);
      setLockedAchievements(lockedAchievements);
    }
    
    getAchievements();
  }, [])

  return (
    <>
      <h2>Unlocked</h2>
      <hr/>
      <div className="grid grid-cols-4 gap-4">
        {unlockedAchievements?.map(achievement => (
          <AchievementItem
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            xp={achievement.xp}
            imageUrl={achievement.image_url}
            unlocked
          />
        ))}
      </div>

      <h2>Locked</h2>
      <hr/>
      <div className="grid grid-cols-4 gap-4">
        {lockedAchievements?.map(achievement => (
          <AchievementItem
            key={achievement.id}
            title={achievement.title}
            description={achievement.description}
            xp={achievement.xp}
            imageUrl={achievement.image_url}
          />
        ))}
      </div>
    </>
  );
};

export default ProgressionAchievements;