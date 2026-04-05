import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";
import { useAuth } from "@providers/AuthProvider";
import { supabase } from "@lib/supabaseClient";
import { toast } from "@lib/toast";
import { Button, Ping } from "@components";
import { FaCaretUp } from "react-icons/fa";

const XP_NEEDED_FOR_LEVEL = 250;

const ProgressionLevel = () => {
  const { user, setUserProfile } = useAuth();
  const { statistics, level, xp, checkedIn, checkingIn, setCheckedIn, setCheckingIn } = useOutletContext<ProgressionOutletContext>();

  const nextXP = (Math.floor(xp / XP_NEEDED_FOR_LEVEL) + 1) * XP_NEEDED_FOR_LEVEL;
  const previousXP = nextXP - XP_NEEDED_FOR_LEVEL;
  const xpLeft = nextXP - xp;
  const percentage = ((XP_NEEDED_FOR_LEVEL - xpLeft) / XP_NEEDED_FOR_LEVEL) * 100;

  const handleCheckIn = async () => {
    if (!user) return;
    setCheckingIn(true);
    const { error } = await supabase.rpc('daily_check_in', {
      p_user_id: user.id
    });
    if (error) {
      toast.error("Could not check in, please try again later");
      console.error(error.message);
      return;
    }
    setUserProfile(prev => {
      if (!prev) return prev;
      return {
        ...prev,
        daily_check_in: true
      }
    });
    toast.success("You have checked in! +100xp");
    setCheckedIn(true);
    setCheckingIn(false);
  }

  return (
    <>
      <h2>Overview</h2>
      <p className="subtitle">View your progress!</p>
      <hr className="divider"/>
      <div className="flex justify-center w-full">
        <div className="flex flex-col gap-2 items-center justify-center w-full max-w-200">
          <div className="flex flex-row gap-2">
            <h2 className="p-2 bg-surface-secondary rounded-2xl">Level: {level}</h2>
            <h2 className="p-2 bg-surface-secondary rounded-2xl">XP: {xp}</h2>
          </div>
          <div className="w-full bg-error rounded-full h-2 justify-center items-center">
            <div className="bg-success h-2 rounded-full" style={{ width: `${percentage}%`}}/>
          </div>
          <div className="w-full flex flex-row justify-between">
            <div className="flex flex-col items-center justify-center">
              <FaCaretUp className="size-5 sm:size-7" />
              <h2>{previousXP}</h2>
            </div>
            <div className="flex flex-col items-center justify-center">
              <FaCaretUp className="size-5 sm:size-7" />
              <h2>{nextXP}</h2>
            </div>
          </div>
        </div>
      </div>
      <h2 className="mt-5">Time</h2>
      <p className="subtitle">See how long you've studied!</p>
      <hr className="divider"/>
      <h3>Days Studied: {statistics?.days_studied} {statistics?.days_studied === 1 ? "day" : "days"}</h3>
      <h3>Current Streak: {statistics?.current_streak} {statistics?.current_streak === 1 ? "day" : "days"}</h3>
      <h3>Best Streak: {statistics?.best_streak} {statistics?.best_streak === 1 ? "day" : "days"}</h3>

      <Button
        disabled={checkedIn}
        loading={checkingIn}
        loadingMessage="Checking in..."
        onClick={handleCheckIn}
        className="relative w-fit mt-5"
      >
        {checkedIn ? "Checked In For Today!" : "Claim your daily check-in!"}
        <Ping
          show={!checkedIn}
          offset={-4}
          corner="topRight"
        />
      </Button>
    </>
  );
};

export default ProgressionLevel;