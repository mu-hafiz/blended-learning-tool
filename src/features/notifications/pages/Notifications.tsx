import { useNotif } from "@providers/NotifProvider";
import { Button, PageContainer, PopupContainer } from "@components";
import NotificationItem from "../components/NotificationItem";
import { ImDrawer2 } from "react-icons/im";
import { FaBoxArchive, FaEnvelopeOpenText } from "react-icons/fa6";
import { useState } from "react";
import ArchivePopup from "../components/ArchivePopup";

const Notifications = () => {
  const { unarchived, markAllRead } = useNotif();
  const [showArchivePopup, setShowArchivePopup] = useState(false);

  return (
    <>
      <PageContainer title="Notifications">
        <div className="basic-container">
          <div className="flex flex-row justify-between">
            <Button
              variant="danger"
              onClick={() => setShowArchivePopup(true)}
              className="gap-2"
            >
              Archived
              <FaBoxArchive size={16}/>
            </Button>
            <Button
              variant="primary"
              onClick={() => markAllRead()}
              className="gap-2"
            >
              Mark all as read
              <FaEnvelopeOpenText size={16}/>
            </Button>
          </div>
          <hr className="divider" />
          {unarchived.length > 0 ? (
            <ul className="flex flex-col gap-2">
              {unarchived.map((notif) => (
                <NotificationItem key={notif.id} notif={notif} />
              ))}
            </ul>
          ) : (
            <div className="flex flex-col flex-1 items-center justify-center">
              <ImDrawer2 size={100}/>
              <h1 className="mt-5">No notifications yet...</h1>
              <h2>Check back again later!</h2>
            </div>
          )}
        </div>
      </PageContainer>
      <PopupContainer
        open={showArchivePopup}
        onClose={() => setShowArchivePopup(false)}
      >
        <ArchivePopup />
      </PopupContainer>
    </>
  );
}

export default Notifications;