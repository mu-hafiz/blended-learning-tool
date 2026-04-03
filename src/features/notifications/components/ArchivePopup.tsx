import { useNotif } from "@providers/NotifProvider";
import ArchiveItem from "./ArchiveItem";
import { ImDrawer2 } from "react-icons/im";

const ArchivePopup = () => {
  const { archived } = useNotif();

  return (
    <>
      <h2 className="text-center">Archived Notifications</h2>
      <hr className="divider mt-5"/>
      {archived.length > 0 ? (
        <ul className="flex flex-1 flex-col gap-2 overflow-y-auto overflow-x-clip">
          {archived.map((notif) => (
            <ArchiveItem key={notif.id} notif={notif} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-col flex-1 items-center justify-center">
          <ImDrawer2 size={100}/>
          <h1 className="mt-5">No notifications yet...</h1>
          <h2>Check back again later!</h2>
        </div>
      )}
    </>
  ); 
};

export default ArchivePopup;