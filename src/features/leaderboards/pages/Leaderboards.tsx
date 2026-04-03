import { Button, Dropdown, PageContainer } from "@components";
import { useLoading } from "@providers/LoadingProvider";
import { useEffect, useState } from "react";
import { RiCheckboxBlankLine } from "react-icons/ri";
import { RiCheckboxLine } from "react-icons/ri";
import StatisticsDB from "@lib/db/userStatistics";
import type { StatisticsWithUserAndPrivacy } from "@models/tables";
import { useAuth } from "@providers/AuthProvider";
import { wordsToSnakeCase, snakeCaseToWords } from "@utils/stringManip";
import { MdLeaderboard } from "react-icons/md";
import type { LeaderboardUser, JustStatistics } from "../types/stateTypes";
import LeaderboardItem from "../components/LeaderboardItem";
import FriendsDB from "@lib/db/friends";

const Leaderboards = () => {
  const { user } = useAuth();
  const [myUsername, setMyUsername] = useState<string>();
  const [friendsEnabled, setFriendsEnabled] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const [allStatistics, setAllStatistics] = useState<StatisticsWithUserAndPrivacy[] | undefined>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>();
  const [statOptions, setStatOptions] = useState<string[]>([]);
  const [selectedStat, setSelectedStat] = useState<string>("Days Studied");
  const [friendIds, setFriendIds] = useState<string[]>();
  
  useEffect(() => {
    if (!user || allStatistics === undefined) {
      showLoading("Fetching all statistics...");
    } else {
      hideLoading();
      return;
    }

    if (!user) return;

    const getStatistics = async () => {
      const statistics = await StatisticsDB.getLeaderboardStatisticsAllUsers(user.id);
      setAllStatistics(statistics);
      if (statistics.length !== 0) {
        const { user, user_id, created_at, ...rest } = statistics[0];
        setStatOptions(Object.keys(rest).map(stat => snakeCaseToWords(stat)));
      }
      hideLoading();
    };

    const getFriends = async () => {
      const friends = await FriendsDB.getFriends(user.id);
      setFriendIds(friends.map(f => f.friend.user_id));
    }

    getStatistics();
    getFriends();
  }, [user]);

  useEffect(() => {
    if (!selectedStat || !allStatistics) return;

    const myUser = allStatistics.find(u => u.user_id === user?.id);
    setMyUsername(myUser?.user.username);

    const stat = wordsToSnakeCase(selectedStat) as keyof JustStatistics;
    let filtered;
    if (friendsEnabled) {
      filtered = allStatistics.filter(u => friendIds?.includes(u.user_id) || u.user_id === user?.id);
    } else {
      filtered = allStatistics;
    }
    
    const leaderboardItems = filtered.map(u => ({
        username: u.user.username,
        level: u.user.level,
        stat: u[stat],
        profilePicture: u.user.profile_picture,
        levelPrivacy: u.user.user_privacy?.level
      }));
    leaderboardItems.sort((a, b) => {
      const primarySort = b.stat - a.stat;
      if (primarySort !== 0) return primarySort;
      return (b.level - a.level);
    });

    setLeaderboard(leaderboardItems);
  }, [selectedStat, friendsEnabled, allStatistics]);

  const onStatChange = (stat: string) => {
    setSelectedStat(stat);
  }

  return (
    <PageContainer title="Leaderboards">
      <div className="basic-container">
        <div className="flex justify-between items-center">
          <Dropdown
            placeholder="Select Statistic"
            options={statOptions}
            onChange={onStatChange}
            value={selectedStat}
            disabled={statOptions.length === 0}
          />
          <Button
            className="flex flex-row items-center"
            variant={friendsEnabled ? "success" : "danger"}
            onClick={() => setFriendsEnabled(!friendsEnabled)}
          >
            Friends
            {
              friendsEnabled
              ? <RiCheckboxLine size={20} className="ml-2" />
              : <RiCheckboxBlankLine size={20} className="ml-2" />
            }
            
          </Button>
        </div>
        <hr className="divider"/>
        {!allStatistics || allStatistics.length === 0 ? (
          <div className="flex flex-col flex-1 items-center justify-center">
            <MdLeaderboard size={100}/>
            <h1 className="mt-5">No users to compare to...</h1>
          </div>
        ) : (
          <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {leaderboard?.map((u, idx) => (
              <LeaderboardItem
                username={u.username}
                myUsername={myUsername}
                stat={u.stat}
                level={u.level}
                key={u.username}
                position={idx + 1}
                profilePicture={u.profilePicture}
                levelPrivacy={u.levelPrivacy}
              />
            ))}
          </ul>
        )}
      </div>
    </PageContainer>
  )
};

export default Leaderboards;