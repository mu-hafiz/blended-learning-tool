import type { Achievement, StatisticsWithCourse } from "@models/tables"

export type ProgressionOutletContext = {
  unlockedAchievements: Achievement[];
  lockedAchievements: Achievement[];
  level: number;
  xp: number;
  allStatistics: StatisticsWithCourse[];
  accumulatedStatistics: Record<string, number>;
};