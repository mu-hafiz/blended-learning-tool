import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";

const ProgressionStatistics = () => {
  const { statistics } = useOutletContext<ProgressionOutletContext>();

  return (
    <>
      <h2>Time</h2>
      <p className="subtitle">See how long you've studied!</p>
      <hr className="divider"/>

      <h3>Days Studied: {statistics?.days_studied}</h3>
      <h3>Current Streak: {statistics?.current_streak}</h3>
      <h3>Best Streak: {statistics?.best_streak}</h3>

      <h2 className="mt-5">Flashcards</h2>
      <hr className="divider"/>

      <h3>Flashcard Sets Completed: {statistics?.flashcard_sets_completed}</h3>
      <h3>Flashcard Sets Created: {statistics?.flashcard_sets_created}</h3>
      <h3>Flashcards Used: {statistics?.flashcards_used}</h3>
    </>
  );
};

export default ProgressionStatistics;