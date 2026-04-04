import type { Notification } from "@models/tables";
import { useNotif } from "@providers/NotifProvider";
import { Button, Tooltip } from "@components";
import { twMerge } from "tailwind-merge";
import { notifIcons } from "../constants/notifications";
import { RiInboxUnarchiveFill } from "react-icons/ri";

const ArchiveItem = ({ notif }: { notif: Notification }) => {
  const { updateArchived } = useNotif();
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
            text="Unarchive"
          >
            <Button
              variant="danger"
              onClick={() => updateArchived({ notifId: notif.id, archived: !notif.archived })}
              className="whitespace-nowrap"
            >
              <RiInboxUnarchiveFill className="size-4"/>
            </Button>
          </Tooltip>
        </div>
      </li>
    </Tooltip>
  );
};

export default ArchiveItem;