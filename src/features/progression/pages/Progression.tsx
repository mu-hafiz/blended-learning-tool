import { PageContainer, Tabs } from "@components"
import { Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import { useState, useEffect } from "react";
import type { Achievement, StatisticsWithCourse } from "@models/tables";
import AchievementsDB from "@lib/db/achievements";
import UnlockedAchievementsDB from "@lib/db/unlockedAchievements";
import UserDB from "@lib/db/users"
import UserStatsDB from "@lib/db/userStatistics";
import { tryCatch } from "@utils/tryCatch";
import { toast } from "@lib/toast";

const routes = ["level", "achievements", "statistics"];

const Progression = () => {
  const { user } = useAuth();
  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[]>([]);
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[]>([]);
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [allStatistics, setAllStatistics] = useState<StatisticsWithCourse[]>([]);
  const [accumulatedStatistics, setAccumulatedStatistics] = useState<Record<string, number>>();

  useEffect(() => {
    if (!user) return;

    const getAchievements = async () => {
      const { data: achievements, error: achievementsError } = await tryCatch(AchievementsDB.getAchievements());
      const { data: unlockedAchievements, error: unlockedError } = await tryCatch(UnlockedAchievementsDB.getUnlockedAchievements(user.id));
      if (achievementsError || unlockedError) {
        toast.error("Could not get achievements, please try again later");
        return;
      }
      const unlockedIds = unlockedAchievements.map(achievement => achievement.id);
      const lockedAchievements = achievements.filter(achievement => !unlockedIds.includes(achievement.id));
      setUnlockedAchievements(unlockedAchievements);
      setLockedAchievements(lockedAchievements);
    }

    const getUserLevel = async () => {
      const { data: userData, error } = await tryCatch(UserDB.getUser(user.id));
      if (error) {
        toast.error("Could not get your level, please try again later");
        return;
      }
      setLevel(userData.level);
      setXp(userData.xp);
    }
    
    const getStatistics = async () => {
      const { data: statistics, error } = await tryCatch(UserStatsDB.getStatistics(user.id));
      if (error) {
        toast.error("Could not get your statistics, please try again later");
        return;
      }
      setAllStatistics(statistics);
    }

    const getAccumulatedStatistics = async () => {
      const { data: statistics, error } = await tryCatch(UserStatsDB.getAccumulatedStats(user.id));
      if (error) {
        toast.error("Could not get your statistics, please try again later");
        return;
      }
      setAccumulatedStatistics(statistics);
    }
    
    getUserLevel();
    getStatistics();
    getAccumulatedStatistics();
    getAchievements();
  }, [user])

  return (
    <PageContainer title="Progression">
      <Tabs routes={routes} />
      <div className="basic-container rounded-tl-none">
        <Outlet
          context={{
            unlockedAchievements,
            lockedAchievements,
            level,
            xp,
            allStatistics,
            accumulatedStatistics
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Progression;