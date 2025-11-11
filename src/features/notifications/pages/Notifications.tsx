import { useNotif } from "@providers/NotifProvider";
import { Button, PageContainer } from "@components";
import NotificationItem from "../components/NotificationItem";

const Notifications = () => {
  const { notifications, markAllRead } = useNotif();

  return (
    <PageContainer title="Notifications">
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
      <ul className="basic-container rounded-t-none">
        {notifications.map((notif) => (
          <NotificationItem key={notif.id} notif={notif} />
        ))}
      </ul>
    </PageContainer>
  );
}

export default Notifications;