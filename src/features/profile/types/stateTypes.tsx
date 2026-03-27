import type { Statistics, Achievement, Friend, UserPrivacyBoolean } from "@models/tables"

export type ProfileOutletContext = {
  statistics: Statistics | null | undefined;
  achievements: Achievement[] | null | undefined;
  friends: Friend[] | null | undefined;
  privacySettings: UserPrivacyBoolean | null | undefined;
}