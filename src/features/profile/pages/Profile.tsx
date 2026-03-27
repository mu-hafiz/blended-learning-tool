import { Avatar, Button, PopupContainer, Tabs, Tooltip } from "@components";
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

const routeNames = ["statistics", "achievements", "friends"];
const defaultProfilePicture = "defaultProfilePicture.png";

const Profile = () => {
  const { user, userProfile } = useAuth();
  const { username } = useParams();
  const { showLoading, hideLoading } = useLoading();
  const navigate = useNavigate();

  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [friendStatus, setFriendStatus] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [userInfo, setUserInfo] = useState<User | null | undefined>();
  const [statistics, setStatistics] = useState<Statistics | null | undefined>();
  const [achievements, setAchievements] = useState<Achievement[] | null | undefined>();
  const [friends, setFriends] = useState<Friend[] | null | undefined>();
  const [privacySettings, setPrivacySettings] = useState<UserPrivacyBoolean | null | undefined>();

  const myProfile = userProfile?.username === username;

  if (notFound) return <NotFound />

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
          className="flex flex-row items-center gap-2"
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
      <div className="flex flex-col h-[calc(100vh-100px)]">
        <div className="flex flex-row items-center gap-5 mt-2 mb-6">
          <Avatar
            filePath={myProfile || privacySettings?.profile_picture ? userInfo?.profile_picture : defaultProfilePicture}
            size={100}
            className="cursor-pointer"
            onClick={() => setShowProfilePopup(true)}
          />
          <div className="flex flex-col">
            <h1>{userInfo?.username}</h1>
            {(myProfile || privacySettings?.name) &&
              <h2>{userInfo?.first_name} {userInfo?.middle_name} {userInfo?.last_name}</h2>
            }
          </div>
          {(myProfile || privacySettings?.level) && 
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
          }
          {renderFriendButton()}
        </div> 
        <Tabs routes={routeNames} />
        <div className="basic-container rounded-tl-none">
          <Outlet
            context={{
              statistics,
              achievements,
              friends,
              privacySettings
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