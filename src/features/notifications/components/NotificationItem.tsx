import type { Notification } from "@models/tables";
import type { JSX } from "react";
import { FaUserPlus, FaUserCheck, FaHeart } from "react-icons/fa";
import { useNotif } from "@providers/NotifProvider";
import { Button } from "@components";

const notifIcons: Record<string, JSX.Element> = {
  friend_request_received: <FaUserPlus size={40}/>,
  friend_request_accepted: <FaUserCheck size={40}/>,
  like_received: <FaHeart size={40}/>
}

const NotificationItem = ({ notif }: { notif: Notification }) => {
  const { updateRead } = useNotif();

  const icon = notifIcons[notif.type] ?? <div>Test</div>
  const style = notif.read
    ? "bg-surface-secondary text-neutral-400 py-3 px-3 flex flex-row justify-between rounded-2xl shadow-md raise"
    : "bg-surface-secondary py-3 px-3 flex flex-row justify-between rounded-2xl shadow-md raise"

  return (
    <li className={style}>
      <div className="flex flex-row gap-3 items-center">
        {!notif.read && (
          <div className="w-4 h-4 bg-red-500 rounded-full animate-pulse"/>
        )}
        {icon}
        <div>
          <h3>{notif.title}</h3>
          <p>{notif.description}</p>
        </div>
      </div>
      <Button
        variant="secondary"
        onClick={() => updateRead({ notifId: notif.id, read: !notif.read })}
      >
        {notif.read ? "Mark as unread" : "Mark as read"}
      </Button>
    </li>
  );
};

export default NotificationItem;