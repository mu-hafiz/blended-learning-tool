import type { Statistics } from "@models/tables";

export type LeaderboardUser = {
  username: string;
  level: number;
  stat: number;
  profilePicture: string;
  levelPrivacy: string | undefined
}

export type JustStatistics = Omit<Statistics, 'user_id' | 'created_at'>