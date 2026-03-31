import { useOutletContext } from "react-router-dom";
import type { ProgressionOutletContext } from "../types/stateTypes";
import { useAuth } from "@providers/AuthProvider";
import { supabase } from "@lib/supabaseClient";
import { toast } from "@lib/toast";
import { Button } from "@components";

const ProgressionLevel = () => {
  const { user } = useAuth();
  const { statistics, level, xp, checkedIn, checkingIn, setCheckedIn, setCheckingIn } = useOutletContext<ProgressionOutletContext>();

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
    toast.success("You have checked in! +100xp");
    setCheckedIn(true);
    setCheckingIn(false);
  }

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
        {!checkedIn && 
          <>
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
          </>
        }
      </Button>
    </>
  );
};

export default ProgressionLevel;