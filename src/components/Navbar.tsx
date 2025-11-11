import { useNotif } from "@providers/NotifProvider";
import { TbBellFilled } from "react-icons/tb"
import { FaUser } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsFire } from "react-icons/bs";
import { RiBarChart2Fill } from "react-icons/ri";
import { Link } from "react-router-dom"
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@providers/AuthProvider";
import Tooltip from "@components/Tooltip";

type PopupItemProps = {
  title: string;
  route?: string;
  onClick: () => void;
}

const Navbar = () => {
  const { user, signOut } = useAuth();
  const { unread } = useNotif();

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const PopupItem = ({ title, route, onClick }: PopupItemProps) => {
    const popup = (
      <p
        className="border-b border-b-surface-secondary hover:border-b-surface-tertiary hover:-translate-y-0.5 px-0.5 pb-1 -mb-1 transition duration-300 cursor-pointer font-medium"
        onClick={() => onClick()}
      >
        {title}
      </p>
    )
    return route ? <Link to={route}>{popup}</Link> : popup;
  };

  const popupItems = [
    { title: "View Profile", route: `/profile` },
    { title: "Friends", route: "/friends" },
    { title: "Account Settings", route: "/account" },
    { title: "Sign Out", onClick: signOut },
  ]

  return (
    <nav className="bg-surface-primary w-full h-12 flex justify-between sticky top-0 px-6 z-50">
      <div className="flex items-center">
        <div className="raise rounded-lg">
          <Tooltip text="Home" position="bottom" offset={8}>
            <Link to="/dashboard">
              <AiFillHome cursor="pointer" size={30} className="text-primary-button rounded-lg hover:text-primary-button-hover" />
            </Link>
          </Tooltip>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="raise rounded-lg">
          <Tooltip text="Leaderboard" position="bottom" offset={8}>
            <Link to="/leaderboard">
              <RiBarChart2Fill size={30} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
            </Link>
          </Tooltip>
        </div>
        <div className="raise rounded-lg">
          <Tooltip text="Progression" position="bottom" offset={8}>
            <Link to="/progression">
              <BsFire size={26} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
            </Link>
          </Tooltip>
        </div>
        <div className="raise rounded-lg">
          <Tooltip text="Notifications" position="bottom" offset={8}>
            <Link to="/notifications">
              <TbBellFilled size={30} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
            </Link>
            {unread && <div className="absolute bottom-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-pulse" />}
          </Tooltip>
        </div>
        <div ref={popupRef}>
          <div className="raise rounded-lg">
            <Tooltip text="Account" position="bottom" offset={8} disabled={showPopup}>
              <FaUser
                cursor="pointer"
                size={26}
                onClick={() => setShowPopup(true)}
                className="text-primary-button rounded-lg hover:text-primary-button-hover"
              />
            </Tooltip>
          </div>
          {showPopup && (
            <div className="absolute right-2 w-35 mt-1 px-3 py-3 bg-surface-secondary rounded-xl shadow-xl flex flex-col gap-2 text-left">
              {popupItems.map(({ title, route, onClick }) => (
                <PopupItem
                  key={title}
                  title={title}
                  route={route}
                  onClick={() => {
                    onClick?.();
                    setShowPopup(false);
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
  
}

export default Navbar;