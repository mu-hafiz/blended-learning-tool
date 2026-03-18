import { useNotif } from "@providers/NotifProvider";
import { Button, PageContainer } from "@components";
import NotificationItem from "../components/NotificationItem";
import { ImDrawer2 } from "react-icons/im";

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
      {notifications.length > 0 ? (
        <ul className="basic-container rounded-t-none gap-2">
          {notifications.map((notif) => (
            <NotificationItem key={notif.id} notif={notif} />
          ))}
        </ul>
      ) : (
        <div className="flex items-center justify-center basic-container rounded-t-none pb-15">
          <ImDrawer2 size={100}/>
          <h1 className="mt-5">No notifications yet...</h1>
          <h2>Check back again later!</h2>
        </div>
      )}

    </PageContainer>
  );
}

export default Notifications;