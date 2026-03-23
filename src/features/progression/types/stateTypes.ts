import type { Achievement, Statistics } from "@models/tables"

export type ProgressionOutletContext = {
  unlockedAchievements: Achievement[] | undefined;
  lockedAchievements: Achievement[] | undefined;
  level: number;
  xp: number;
  statistics: Statistics | undefined;
};