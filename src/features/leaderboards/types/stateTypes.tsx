import type { Statistics } from "@models/tables";

export type LeaderboardUser = {
  username: string;
  level: number;
  stat: number;
}

export type JustStatistics = Omit<Statistics, 'user_id' | 'created_at'>