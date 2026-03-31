import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";

const ProgressionStatistics = () => {
  const { statistics } = useOutletContext<ProgressionOutletContext>();

  return (
    <>
      <h2>Flashcards</h2>
      <p className="subtitle">Has your repetition paid off?</p>
      <hr className="divider"/>

      <h3>Total Flashcard Sets Used: {statistics?.flashcard_sets_completed}</h3>
      <h3>Flashcard Sets Created: {statistics?.flashcard_sets_created}</h3>
      <h3>Total Flashcards Used: {statistics?.flashcards_used}</h3>
      <h3>Flashcards Answered Correctly: {statistics?.flashcards_correct}</h3>
    </>
  );
};

export default ProgressionStatistics;