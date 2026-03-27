import { useNotif } from "@providers/NotifProvider";
import { Button, PageContainer } from "@components";
import NotificationItem from "../components/NotificationItem";
import { ImDrawer2 } from "react-icons/im";

const Notifications = () => {
  const { notifications, markAllRead } = useNotif();

  return (
    <PageContainer title="Notifications">
      <div className="basic-container">
        <Button
          variant="primary"
          onClick={() => markAllRead()}
        >
          Mark all as read
        </Button>
        <hr className="divider" />
        {notifications.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {notifications.map((notif) => (
              <NotificationItem key={notif.id} notif={notif} />
            ))}
          </ul>
        ) : (
          <div className="flex flex-col h-full items-center justify-center">
            <ImDrawer2 size={100}/>
            <h1 className="mt-5">No notifications yet...</h1>
            <h2>Check back again later!</h2>
          </div>
        )}
      </div>

    </PageContainer>
  );
}

export default Notifications;