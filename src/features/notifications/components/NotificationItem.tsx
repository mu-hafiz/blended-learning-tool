import type { Notification } from "@models/tables";
import { useNotif } from "@providers/NotifProvider";
import { Button, Ping, Tooltip } from "@components";
import { twMerge } from "tailwind-merge";
import { FaBoxArchive, FaEnvelope, FaEnvelopeOpenText, FaRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { notifDefaultLinks, notifIcons } from "../constants/notifications";

const NotificationItem = ({ notif }: { notif: Notification }) => {
  const { updateRead, updateArchived } = useNotif();
  const date = new Date(notif.created_at);
  const notifDate = date.toLocaleDateString("en-GB");
  const notifTime = date.toLocaleTimeString("en-GB");
  const navigate = useNavigate();

  const icon = notifIcons[notif.type] ?? <div>Test</div>

  const handleGo = () => {
    updateRead({ notifId: notif.id, read: true });
    navigate(notif.link ?? notifDefaultLinks[notif.type])
  }
  
  return (
    <Tooltip
      position="top"
      text={`${notifDate} ${notifTime}`}
      className="block md:hidden"
    >
      <li
        className={twMerge(
          "flex flex-row justify-between py-2 md:py-3 px-3 bg-surface-secondary rounded-2xl shadow-md raise relative",
          notif.read ? "text-secondary-text/75" : ""
        )}
      >
        <Ping
          show={!notif.read}
          size={16}
          corner="topLeft"
          offset={-4}
        />
        <div className="flex flex-row gap-3 items-center relative min-w-0 flex-1">
          {icon}
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2">{notif.title}</h3>
            <p className="line-clamp-2">{notif.description}</p>
          </div>
        </div>
        <div className="flex md:flex-row items-center gap-2 md:gap-4 ml-3">
          <div className="hidden md:flex flex-row md:flex-col items-center gap-1 md:gap-0">
            <p className="subtitle">{notifDate}</p>
            <p className="subtitle">{notifTime}</p>
          </div>
          <Tooltip
            position="top"
            text="Check it out!"
          >
            <Button
              className="whitespace-nowrap"
              onClick={handleGo}
            >
              <FaRightLong className="size-4" />
            </Button>
          </Tooltip>
          <Tooltip
            position="top"
            text="Archive"
          >
            <Button
              variant="danger"
              onClick={() => updateArchived({ notifId: notif.id, archived: !notif.archived })}
              className="whitespace-nowrap"
            >
              <FaBoxArchive className="size-4"/>
            </Button>
          </Tooltip>
          <Tooltip
            position="top"
            text={notif.read ? "Mark as unread" : "Mark as read"}
          >
            <Button
              variant="secondary"
              onClick={() => updateRead({ notifId: notif.id, read: !notif.read })}
              className="whitespace-nowrap"
            >
              {notif.read
                ? <FaEnvelopeOpenText className="size-4" />
                : <FaEnvelope className="size-4" />
              }
            </Button>
          </Tooltip>
        </div>
      </li>
    </Tooltip>
  );
};

export default NotificationItem;