import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";

const ProgressionLevel = () => {
  const { level, xp } = useOutletContext<ProgressionOutletContext>();

  return (
    <>
      <h2>Overview</h2>
      <p className="subtitle">View your progress!</p>
      <hr className="divider"/>
      <h3>Level: {level}</h3>
      <h3>XP: {xp}</h3>
    </>
  );
};

export default ProgressionLevel;