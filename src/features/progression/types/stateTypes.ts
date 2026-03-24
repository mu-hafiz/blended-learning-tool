import type { Achievement, Statistics } from "@models/tables"

export type ProgressionOutletContext = {
  unlockedAchievements: Achievement[] | null | undefined;
  lockedAchievements: Achievement[] | null | undefined;
  level: number;
  xp: number;
  statistics: Statistics | null | undefined;
};