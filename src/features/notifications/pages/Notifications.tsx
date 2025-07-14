import { useNotif } from "@providers/NotifProvider";
import { Button } from "@components";
import NotificationItem from "../components/NotificationItem";

const Notifications = () => {
  const { notifications, markAllRead } = useNotif();

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