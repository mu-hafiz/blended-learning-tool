import { PageContainer, Tabs } from "@components"
import { Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import { useState, useEffect } from "react";
import type { Achievement, Statistics } from "@models/tables";
import AchievementsDB from "@lib/db/achievements";
import UnlockedAchievementsDB from "@lib/db/unlockedAchievements";
import UserStatsDB from "@lib/db/userStatistics";
import { tryCatch } from "@utils/tryCatch";
import { toast } from "@lib/toast";
import { useLoading } from "@providers/LoadingProvider";

const routes = ["level", "achievements", "statistics"];

const Progression = () => {
  const { user, userProfile } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  const [unlockedAchievements, setUnlockedAchievements] = useState<Achievement[] | null | undefined>();
  const [lockedAchievements, setLockedAchievements] = useState<Achievement[] | null | undefined>();
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [statistics, setStatistics] = useState<Statistics | null | undefined>();
  const [checkedIn, setCheckedIn] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);

  useEffect(() => {
    if (unlockedAchievements !== undefined && lockedAchievements !== undefined && statistics !== undefined) {
      hideLoading();
    } else {
      showLoading("Fetching your stats...");
    }

    return () => hideLoading();
  }, [unlockedAchievements, lockedAchievements, statistics]);

  useEffect(() => {
    if (!user) return;

    const getAchievements = async () => {
      const { data: achievements, error: achievementsError } = await tryCatch(AchievementsDB.getAchievements());
      const { data: unlockedAchievements, error: unlockedError } = await tryCatch(UnlockedAchievementsDB.getUnlockedAchievements(user.id));
      if (achievementsError || unlockedError) {
        toast.error("Could not get achievements, please try again later");
        setUnlockedAchievements(null);
        setLockedAchievements(null);
        return;
      }
      const unlockedIds = unlockedAchievements.map(achievement => achievement.id);
      const lockedAchievements = achievements.filter(achievement => !unlockedIds.includes(achievement.id));
      lockedAchievements.sort((a, b) => {
        return a.unlock_type.localeCompare(b.unlock_type) || a.xp - b.xp
      });
      unlockedAchievements.sort((a, b) => {
        return a.unlock_type.localeCompare(b.unlock_type) || a.xp - b.xp
      });
      setUnlockedAchievements(unlockedAchievements);
      setLockedAchievements(lockedAchievements);
    }
    
    const getStatistics = async () => {
      const { data: statistics, error } = await tryCatch(UserStatsDB.getStatistics(user.id));
      if (error) {
        toast.error("Could not get your statistics, please try again later");
        setStatistics(null);
        return;
      }
      setStatistics(statistics);
    }
    
    getStatistics();
    getAchievements();
  }, [user]);

  useEffect(() => {
    if (!userProfile) return;
    setLevel(userProfile.level);
    setXp(userProfile.xp);
    setCheckedIn(userProfile.daily_check_in);
  }, [userProfile]);

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
            statistics,
            checkedIn,
            checkingIn,
            setCheckedIn,
            setCheckingIn
          }}
        />
      </div>
    </PageContainer>
  );
};

export default Progression;