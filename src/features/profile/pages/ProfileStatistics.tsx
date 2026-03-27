import { useOutletContext } from "react-router-dom";
import type { ProfileOutletContext } from "../types/stateTypes";
import { FaLock } from "react-icons/fa";

const ProfileStatistics = () => {
  const { statistics, privacySettings, myProfile } = useOutletContext<ProfileOutletContext>();

  if (!myProfile && !privacySettings?.statistics) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <FaLock size={100} className="mb-5"/>
        <h1>Private</h1>
        <h2>You are not permitted to view...</h2>
      </div>
    );
  }

  return (
    <>
      <h2>Time</h2>
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
}

export default ProfileStatistics;