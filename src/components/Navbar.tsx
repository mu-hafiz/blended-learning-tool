import { useNotif } from "@providers/NotifProvider";
import { TbBellFilled } from "react-icons/tb"
import { FaUser } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { BsFire } from "react-icons/bs";
import { Link } from "react-router-dom"
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@providers/AuthProvider";


type PopupItemProps = {
  title: string;
  route?: string;
  onClick: () => void;
}

const Navbar = () => {
  const { signOut } = useAuth();
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
      <div
        className="border-b border-b-surface-secondary hover:border-b-surface-tertiary hover:-translate-y-0.5 px-2 transition duration-300 cursor-pointer"
        onClick={() => onClick()}
      >
        {title}
      </div>
    )
    return route ? <Link to={route} className="text-primary-text">{popup}</Link> : popup;
  };

  const popupItems = [
    { title: "View Profile", route: "/" },
    { title: "Friends", route: "/friends" },
    { title: "Account Settings", route: "/account" },
    { title: "Sign Out", onClick: signOut },
  ]

  return (
    <nav className="bg-surface-primary w-full h-16 flex justify-between sticky top-0 px-6 z-50">
      <div className="flex items-center raise">
        <Link to="/dashboard">
          <AiFillHome cursor="pointer" size={40} className="text-primary-button" />
        </Link>
      </div>
      <div className="flex items-center gap-6">
        <div className="relative inline-block cursor-pointer raise">
          <Link to="/notifications">
            <TbBellFilled size={40} className="text-primary-button" />
          </Link>
          {unread && <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse" />}
        </div>
        <div className="relative inline-block cursor-pointer raise">
          <Link to="/progression">
            <BsFire size={40} className="text-primary-button" />
          </Link>
        </div>
        <div className="relative" ref={popupRef}>
          <FaUser cursor="pointer" size={36} onClick={() => setShowPopup(true)} className="text-primary-button raise" />
          {showPopup && (
            <div className="absolute right-0 w-40 mt-1 px-3 py-3 bg-surface-secondary rounded-xl shadow-xl flex flex-col gap-2 text-left">
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