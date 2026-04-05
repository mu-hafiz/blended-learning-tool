import { Avatar, Button, PageContainer, PopupContainer, Tabs, Tooltip } from "@components";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import { useEffect, useState } from "react";
import { useLoading } from "@providers/LoadingProvider";
import { tryCatch } from "@utils/tryCatch";
import UserDB from "@lib/db/users";
import FriendsDB from "@lib/db/friends";
import UserStatsDB from "@lib/db/userStatistics";
import AchievementsDB from "@lib/db/unlockedAchievements";
import PrivacyDB from "@lib/db/userPrivacy";
import { toast } from "@lib/toast";
import type { User, Statistics, Achievement, Friend, UserPrivacyBoolean } from "@models/tables";
import { PiStarFill } from "react-icons/pi";
import NotFound from "@pages/NotFound";
import { FaPencil } from "react-icons/fa6";
import { addFriend, cancelRequest } from "@lib/friends";
import { GiSmallFire } from "react-icons/gi";
import AboutMePopup from "../components/AboutMePopup";
import { RxChevronRight } from "react-icons/rx";

const routeNames = ["statistics", "achievements", "friends"];

const Profile = () => {
  const { user, userProfile } = useAuth();
  const { username } = useParams();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showAboutMePopup, setShowAboutMePopup] = useState(false);
  const [friendStatus, setFriendStatus] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null | undefined>();
  const [statistics, setStatistics] = useState<Statistics | null | undefined>();
  const [achievements, setAchievements] = useState<Achievement[] | null | undefined>();
  const [friends, setFriends] = useState<Friend[] | null | undefined>();
  const [privacySettings, setPrivacySettings] = useState<UserPrivacyBoolean | null | undefined>();

  const myProfile = userProfile?.username === username;

  if (notFound) {
    return (
      <NotFound
        title="That doesn't seem right..."
        description="Can't view this profile, please try again later"
      />
    )
  }

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
        setNotFound(true);
        setUserInfo(null);
        return;
      };
      setUserInfo(data);
    }

    if (myProfile) {
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

    const fetchPrivacySettings = async () => {
      if (!userProfile) return;
      const { data: settings, error } = await tryCatch(PrivacyDB.getPrivacySettingsForUser(userProfile.user_id, userInfo.user_id));
      if (error) {
        toast.error("Could not get privacy settings, please try again later");
        setPrivacySettings(null);
        return;
      };
      setPrivacySettings(settings);
    }

    fetchAchievements();
    fetchStatistics();
    fetchFriends();
    fetchPrivacySettings();
  }, [userInfo]);

  useEffect(() => {
    const fetchFriendStatus = async () => {
      if (!userProfile || !userInfo || myProfile) return;
      const { data, error } = await tryCatch(FriendsDB.checkFriendStatus(userProfile.user_id, userInfo.user_id));
      if (error) {
        toast.error("Could not get friends status, please try again later");
        return;
      }
      setFriendStatus(data);
    }

    fetchFriendStatus();
  }, [userInfo, userProfile])

  const handleAddRequest = async () => {
    await addFriend(userProfile?.user_id, userInfo?.user_id!);
    setFriendStatus("request_sent");
  }

  const handleCancelRequest = async () => {
    await cancelRequest(user, userInfo?.user_id!, userInfo?.username!);
    setFriendStatus("not_friends");
  }

  const renderFriendButton = () => {
    if (myProfile) {
      return (
        <Button
          onClick={() => navigate("/account/profile")}
          className="flex flex-row items-center gap-2 ml-2"
        >
          <FaPencil size={20} />
          Edit Profile
        </Button>
      )
    }

    switch (friendStatus) {
      case "not_friends":
        return <Button variant="success" onClick={() => handleAddRequest()}>Send Friend Request</Button>;
      case "request_sent":
        return <Button variant="danger" onClick={() => handleCancelRequest()}>Remove Request</Button>;
      case "request_received":
        return <Button onClick={() => navigate("/friends/incoming")}>See Requests</Button>;
      case "friends":
        return <Button variant="success" disabled>Already friends!</Button>;
    }
  }

  return (
    <>
      <PageContainer>
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex flex-col items-center sm:items-start mt-2 mb-4">
            <div className="flex flex-row items-center gap-5">
              <Avatar
                filePath={userInfo?.profile_picture}
                classNameSize="size-22 md:25"
                className="cursor-pointer"
                onClick={() => setShowProfilePopup(true)}
              />
              <div className="flex flex-col justify-center min-w-0">
                <h1 className="line-clamp-2 break-all leading-7 sm:leading-8 mb-1">{userInfo?.username}</h1>
                {(myProfile || privacySettings?.name) &&
                  <h2 className="truncate">{userInfo?.first_name} {userInfo?.middle_name} {userInfo?.last_name}</h2>
                }
              </div>
            </div>
            <div className="flex flex-row items-center gap-2 mt-4">
              {(myProfile || privacySettings?.level) && 
                <Tooltip
                  text={`XP: ${userInfo?.xp}`}
                  position="top"
                  offset={5}
                >
                  <div className="w-18 h-10 flex flex-row items-center justify-center gap-2 rounded-full bg-surface-secondary">
                    <PiStarFill size={25} color="yellow"/>
                    <h2>{userInfo?.level}</h2>
                  </div>
                </Tooltip>
              }
              {(myProfile || privacySettings?.statistics) && 
                <Tooltip
                  text={`Current Streak: ${statistics?.current_streak}`}
                  position="top"
                  offset={5}
                >
                  <div className="w-18 h-10 flex flex-row items-center justify-center gap-2 rounded-full bg-surface-secondary">
                    <GiSmallFire size={25} color="orange"/>
                    <h2>{statistics?.current_streak}</h2>
                  </div>
                </Tooltip>
              }
              {renderFriendButton()}
            </div>
          </div>
          {userInfo?.about_me && (
            <div className="relative flex flex-row lg:flex-col h-fit items-center justify-center gap-4 lg:max-w-100 mb-5 lg:mb-0 bg-surface-primary rounded-2xl p-3 pr-10">
              <h2 className="text-center sm:text-left sm:whitespace-nowrap">About Me:</h2>
              <p className="line-clamp-6 text-ellipsis whitespace-pre-wrap">{userInfo?.about_me}</p>
              <RxChevronRight
                size={50}
                className="absolute top-1/2 -translate-y-1/2 right-0 transition-transform hover:translate-x-1 ease-out duration-200 cursor-pointer"
                onClick={() => setShowAboutMePopup(true)}
              />
            </div>
          )}
        </div>
        <Tabs routes={routeNames} />
        <div className="basic-container rounded-tl-none">
          <Outlet
            context={{
              statistics,
              achievements,
              friends,
              privacySettings,
              myProfile
            }}
          />
        </div>
      </PageContainer>
      <PopupContainer
        open={showProfilePopup}
        onClose={() => setShowProfilePopup(false)}
        sizeClassName="size-fit sm:size-fit"
      >
        <div className="flex flex-1 items-center justify-center">
          <Avatar
            filePath={userInfo?.profile_picture}
            classNameSize="size-50 sm:size-60"
          />
        </div>
      </PopupContainer>
      <PopupContainer
        open={showAboutMePopup}
        onClose={() => setShowAboutMePopup(false)}
        sizeClassName="h-fit sm:h-fit max-h-150"
      >
        <AboutMePopup aboutMe={userInfo?.about_me} />
      </PopupContainer>
    </>
  )
};

export default Profile;