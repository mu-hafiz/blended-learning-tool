import { useEffect, useState } from "react";
import UserDB from "@lib/db/users"
import UserStatsDB from "@lib/db/userStatistics";
import { useAuth } from "@providers/AuthProvider";

const ProgressionLevel = () => {
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [accumulatedStatistics, setAccumulatedStatistics] = useState<Record<string, number>>();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const getUserLevel = async () => {
      const userData = await UserDB.getUser(user.id);
      setLevel(userData.level);
      setXp(userData.xp);
    }

    const getAccumulatedStatistics = async () => {
      const statistics = await UserStatsDB.getAccumulatedStats(user.id);
      setAccumulatedStatistics(statistics);
    }

    getUserLevel();
    getAccumulatedStatistics();
  }, [user]);

  return (
    <>
      <h2>Level: {level}</h2>
      <h2>XP: {xp}</h2>

      <h2>Time</h2>
      <hr/>

      <h3>Days Studied: {accumulatedStatistics?.days_studied || 0}</h3>
      <h3>Current Streak: {accumulatedStatistics?.current_streak || 0}</h3>
      <h3>Best Streak: {accumulatedStatistics?.best_streak || 0}</h3>
    </>
  );
};

export default ProgressionLevel;