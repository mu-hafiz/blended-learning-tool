import { Avatar, PageContainer, PopupContainer, Tabs, Tooltip } from "@components";
import { Outlet, useParams } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { useLoading } from "@providers/LoadingProvider";
import { tryCatch } from "@utils/tryCatch";
import UserDB from "@lib/db/users";
import FriendsDB from "@lib/db/friends";
import UserStatsDB from "@lib/db/userStatistics";
import AchievementsDB from "@lib/db/unlockedAchievements";
import { toast } from "@lib/toast";
import type { User, Statistics, Achievement, Friend } from "@models/tables";
import { PiStarFill } from "react-icons/pi";

const routeNames = ["statistics", "achievements", "friends"];

const Profile = () => {
  const { user, userProfile } = useAuth();
  const { username } = useParams();
  const { showLoading, hideLoading } = useLoading();

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null | undefined>();
  const [statistics, setStatistics] = useState<Statistics | null | undefined>();
  const [achievements, setAchievements] = useState<Achievement[] | null | undefined>();
  const [friends, setFriends] = useState<Friend[] | null | undefined>();

  useEffect(() => {
    if (
      userInfo !== undefined && statistics !== undefined
      && achievements !== undefined && friends !== undefined
    ) {
      hideLoading();
    } else {
      showLoading("Fetching user info...");
    }

    return () => hideLoading();
  }, [userInfo, statistics, achievements, friends]);

  useEffect(() => {
    if (!user) return;

    const fetchUser = async () => {
      const { data, error } = await tryCatch(UserDB.getUserByUsername(username!));
      if (error) {
        toast.error("Could not get user information, please try again later");
        setUserInfo(null);
        return;
      };
      setUserInfo(data);
    }

    if (username === "me") {
      setUserInfo(userProfile);
    } else {
      fetchUser();
    }
  }, [user, username, userProfile]);

  useEffect(() => {
    if (!userInfo) return;

    const fetchAchievements = async () => {
      const { data: achievements, error } = await tryCatch(AchievementsDB.getUnlockedAchievements(userInfo.user_id));
      if (error) {
        toast.error("Could not get user achievements, please try again later");
        setAchievements(null);
        return;
      }
      setAchievements(achievements);
    }

    const fetchStatistics = async () => {
      const { data: statistics, error } = await tryCatch(UserStatsDB.getStatistics(userInfo.user_id));
      if (error) {
        toast.error("Could not get user statistics, please try again later");
        setStatistics(null);
        return;
      }
      setStatistics(statistics);
    }

    const fetchFriends = async () => {
      const { data: friends, error } = await tryCatch(FriendsDB.getFriends(userInfo.user_id));
      if (error) {
        toast.error("Could not get user friends, please try again later");
        setFriends(null);
        return;
      };
      setFriends(friends);
    }

    fetchAchievements();
    fetchStatistics();
    fetchFriends();
  }, [userInfo]);

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="flex flex-row items-center gap-5 mt-2 mb-6">
          <Avatar
            filePath={userInfo?.profile_picture}
            size={100}
            className="cursor-pointer"
            onClick={() => setShowProfilePopup(true)}
          />
          <div className="flex flex-col">
            <h1>{userInfo?.username}</h1>
            <h2>{userInfo?.first_name} {userInfo?.middle_name} {userInfo?.last_name}</h2>
          </div>
          <Tooltip
            text={`XP: ${userInfo?.xp}`}
            position="top"
            offset={5}
          >
            <div className="w-18 h-10 flex flex-row items-center justify-center gap-1 rounded-full bg-surface-secondary">
              <PiStarFill size={25} color="yellow"/>
              <h2>{userInfo?.level}</h2>
            </div>
          </Tooltip>
        </div> 
        <Tabs routes={routeNames} />
        <div className="basic-container rounded-tl-none">
          <Outlet
            context={{
              statistics,
              achievements,
              friends
            }}
          />
        </div>
      </div>
      <PopupContainer
        open={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
      >
        <Avatar
          filePath={userInfo?.profile_picture}
          size={300}
        />
      </PopupContainer>
    </>
  )
};

export default Profile;