import { useNotif } from "@providers/NotifProvider";
import { TbBellFilled } from "react-icons/tb"
import { FaUserFriends } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsFire } from "react-icons/bs";
import { MdLeaderboard } from "react-icons/md";
import { Link } from "react-router-dom"
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@providers/AuthProvider";
import Tooltip from "@components/Tooltip";
import Avatar from "./Avatar";
import { TbCardsFilled } from "react-icons/tb";
import { useTheme } from "@providers/ThemeProvider";
import Ping from "./Ping";

type PopupItemProps = {
  title: string;
  route?: string;
  onClick: () => void;
}

const PopupItem = ({ title, route, onClick }: PopupItemProps) => {
  const popup = (
    <p
      className="border-b border-b-surface-secondary hover:border-b-surface-tertiary hover:-translate-y-0.5 px-0.5 pb-1 -mb-1 transition duration-300 cursor-pointer font-medium text-sm"
      onClick={() => onClick()}
    >
      {title}
    </p>
  )
  return route ? <Link to={route}>{popup}</Link> : popup;
};

const Navbar = () => {
  const { userProfile, signOut } = useAuth();
  const { unread } = useNotif();
  const { hasUnused } = useTheme();

  const [showPopup, setShowPopup] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);

  const popupItems = [
    { title: "View Profile", route: `/profile/${userProfile?.username}` },
    { title: "Account Settings", route: "/account" },
    { title: "Sign Out", onClick: signOut },
  ]

  useEffect(() => {
    const handleClickOutside = (event: PointerEvent) => {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        setShowPopup(false);
      }
    }
    document.addEventListener("pointerdown", handleClickOutside);
    return () => document.removeEventListener("pointerdown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-surface-primary w-full h-12 flex justify-between sticky top-0 px-6 z-50 border-b-2 border-b-surface-tertiary">
      <div className="flex items-center gap-3 sm:gap-5">
        <div className="raise rounded-lg">
          <Tooltip text="Home" position="bottom" offset={8}>
            <Link to="/dashboard">
              <AiFillHome cursor="pointer" size={30} className="text-primary-button rounded-lg hover:text-primary-button-hover transition-colors duration-300" />
            </Link>
          </Tooltip>
        </div>

        <div className="h-7/12 border-l-2 border-surface-tertiary" />

        <div className="raise rounded-lg">
          <Tooltip text="Flashcards" position="bottom" offset={8}>
            <Link to="/flashcards">
              <TbCardsFilled size={30} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
            </Link>
          </Tooltip>
        </div>

        <div className="h-7/12 border-l-2 border-surface-tertiary" />

      </div>
      <div className="flex items-center gap-3 sm:gap-4">

        <div className="h-7/12 border-l-2 border-surface-tertiary" />

        <div className="raise rounded-lg">
          <Tooltip text="Leaderboards" position="bottom" offset={8}>
            <Link to="/leaderboards">
              <MdLeaderboard size={30} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
            </Link>
          </Tooltip>
        </div>
        <div className="raise rounded-lg">
          <Tooltip text="Progression" position="bottom" offset={8}>
            <Link to="/progression">
              <BsFire size={26} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
              <Ping show={!userProfile?.daily_check_in} offset={-5} />
            </Link>
          </Tooltip>
        </div>

        <div className="h-7/12 border-l-2 border-surface-tertiary" />

        <div className="raise rounded-lg">
          <Tooltip text="Friends" position="bottom" offset={8}>
            <Link to="/friends">
              <FaUserFriends size={30} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
            </Link>
          </Tooltip>
        </div>
        <div className="raise rounded-lg">
          <Tooltip text="Notifications" position="bottom" offset={8}>
            <Link to="/notifications">
              <TbBellFilled size={30} className="text-primary-button hover:text-primary-button-hover transition-colors duration-300" />
              <Ping show={unread} offset={-3} />
            </Link>
          </Tooltip>
        </div>
        <div ref={popupRef}>
          <div className="raise rounded-lg">
            <Tooltip text="Account" position="bottom" offset={8} disabled={showPopup}>
              <div
                className="cursor-pointer relative flex-shrink"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  setShowPopup(true);
                }}
              >
                <Avatar
                  filePath={userProfile?.profile_picture}
                  size={30}
                />
                <Ping show={hasUnused} offset={-3} />
              </div>
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