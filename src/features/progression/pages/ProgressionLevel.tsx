import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";

const ProgressionLevel = () => {
  const { level, xp, accumulatedStatistics } = useOutletContext<ProgressionOutletContext>();

  return (
    <>
      <h2>Overview</h2>
      <p className="subtitle">View your progress!</p>
      <hr className="divider"/>
      <h3>Level: {level}</h3>
      <h3>XP: {xp}</h3>

      <h2 className="mt-5">Time</h2>
      <p className="subtitle">See how long you've studied!</p>
      <hr className="divider"/>

      <h3>Days Studied: {accumulatedStatistics?.days_studied || 0}</h3>
      <h3>Current Streak: {accumulatedStatistics?.current_streak || 0}</h3>
      <h3>Best Streak: {accumulatedStatistics?.best_streak || 0}</h3>
    </>
  );
};

export default ProgressionLevel;