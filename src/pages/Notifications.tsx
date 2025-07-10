import { useNotif } from "@providers/NotifProvider";
import type { Notification } from "@models/tables";
import type { JSX } from "react";
import { FaUserPlus, FaUserCheck, FaHeart } from "react-icons/fa";
import Button from "@components/Button";

const notifIcons: Record<string, JSX.Element> = {
  friend_request_received: <FaUserPlus size={40}/>,
  friend_request_accepted: <FaUserCheck size={40}/>,
  like_received: <FaHeart size={40}/>
}

const Notifications = () => {
  const { notifications, updateRead, markAllRead } = useNotif();

  const NotificationItem = ({ notif }: { notif: Notification }) => {
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

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 130px)" }}>
      <h1 className="text-left mb-4">Notifications</h1>
      <div className="flex flex-row justify-between bg-surface-primary rounded-t-2xl p-3">
        <Button
          variant="secondary"
          onClick={() => console.log("This will be for filtering notifications")}
        >
          Filters
        </Button>
        <Button
          variant="primary"
          onClick={() => markAllRead()}
        >
          Mark all as read
        </Button>
      </div>
      <ul className="bg-surface-primary rounded-b-2xl flex flex-1 flex-col gap-3 text-left px-3 pt-1 overflow-y-auto">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notif={notif} />
        ))}
      </ul>
    </div>
  );
}

export default Notifications;