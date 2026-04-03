import type { Notification } from "@models/tables";
import type { JSX } from "react";
import { FaUserPlus, FaUserCheck, FaHeart, FaUnlock, FaPaintBrush, FaComment } from "react-icons/fa";
import { HiArrowTrendingUp } from "react-icons/hi2";
import { useNotif } from "@providers/NotifProvider";
import { Button, Tooltip } from "@components";
import { twMerge } from "tailwind-merge";
import { MdBookmarkAdd } from "react-icons/md";

const notifIcons: Record<string, JSX.Element> = {
  achievement_unlocked: <FaUnlock className="size-6 sm:size-10 shrink-0"/>,
  friend_request_received: <FaUserPlus className="size-6 sm:size-10 shrink-0"/>,
  friend_request_accepted: <FaUserCheck className="size-6 sm:size-10 shrink-0"/>,
  like_received: <FaHeart className="size-6 sm:size-10 shrink-0"/>,
  level_up: <HiArrowTrendingUp className="size-6 sm:size-10 shrink-0"/>,
  theme_unlocked: <FaPaintBrush className="size-6 sm:size-10 shrink-0"/>,
  bookmark_received: <MdBookmarkAdd className="size-6 sm:size-10 shrink-0"/>,
  comment_received: <FaComment className="size-6 sm:size-10 shrink-0"/>
}

const NotificationItem = ({ notif }: { notif: Notification }) => {
  const { updateRead } = useNotif();
  const date = new Date(notif.created_at);
  const notifDate = date.toLocaleDateString("en-GB");
  const notifTime = date.toLocaleTimeString("en-GB");

  const icon = notifIcons[notif.type] ?? <div>Test</div>
  
  return (
    <Tooltip
      position="top"
      text={`${notifDate} ${notifTime}`}
      className="block md:hidden"
    >
      <li 
        className={twMerge(
          "flex flex-row justify-between py-2 md:py-3 px-3 bg-surface-secondary rounded-2xl shadow-md raise relative",
          notif.read ? "text-secondary-text" : ""
        )}
      >
        {!notif.read && (
          <>
            <div className="absolute -top-1 -left-1 size-4 bg-red-500 rounded-full shrink-0"/>
            <div className="absolute -top-1 -left-1 size-4 bg-red-500 rounded-full animate-ping shrink-0"/>
          </>
        )}
        <div className="flex flex-row gap-3 items-center relative min-w-0 flex-1">
          {icon}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2">{notif.title}</h3>
            <p className="line-clamp-2">{notif.description}</p>
          </div>
        </div>
        <div className="flex md:flex-row items-center md:gap-4 ml-3">
          <div className="hidden md:flex flex-row md:flex-col items-center gap-1 md:gap-0">
            <p className="subtitle">{notifDate}</p>
            <p className="subtitle">{notifTime}</p>
          </div>
          <Button
            variant="secondary"
            onClick={() => updateRead({ notifId: notif.id, read: !notif.read })}
            className="whitespace-nowrap"
          >
            {notif.read ? "Mark as unread" : "Mark as read"}
          </Button>
        </div>
      </li>
    </Tooltip>
  );
};

export default NotificationItem;