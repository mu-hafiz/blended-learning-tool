import { FaUserPlus, FaUserCheck, FaHeart, FaUnlock, FaPaintBrush, FaComment } from "react-icons/fa";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { MdBookmarkAdd } from "react-icons/md";
import type { JSX } from "react";

export const notifIcons: Record<string, JSX.Element> = {
  achievement_unlocked: <FaUnlock className="size-6 sm:size-10 shrink-0"/>,
  friend_request_received: <FaUserPlus className="size-6 sm:size-10 shrink-0"/>,
  friend_request_accepted: <FaUserCheck className="size-6 sm:size-10 shrink-0"/>,
  like_received: <FaHeart className="size-6 sm:size-10 shrink-0"/>,
  level_up: <HiArrowTrendingUp className="size-6 sm:size-10 shrink-0"/>,
  theme_unlocked: <FaPaintBrush className="size-6 sm:size-10 shrink-0"/>,
  bookmark_received: <MdBookmarkAdd className="size-6 sm:size-10 shrink-0"/>,
  comment_received: <FaComment className="size-6 sm:size-10 shrink-0"/>
}

export const notifDefaultLinks: Record<string, string>= {
  achievement_unlocked: "/progression/achievements",
  friend_request_received: "/friends/incoming",
  friend_request_accepted: "/friends",
  like_received: "/flashcards",
  level_up: "/progression",
  theme_unlocked: "/account/preferences",
  bookmark_received: "/flashcards",
  comment_received: "/flashcards"
}