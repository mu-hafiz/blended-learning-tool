import { useNotif } from "@providers/NotifProvider";
import { TbBellFilled } from "react-icons/tb"
import { FaUser } from "react-icons/fa";
import { AiFillHome } from "react-icons/ai";
import { useLocation, useNavigate } from "react-router-dom"
import { useRef, useState, useEffect } from "react";
import { useAuth } from "@providers/AuthProvider";

type PopupItemProps = {
  title: string;
  onClick: () => void;
}

const Navbar = () => {
  const { signOut } = useAuth();
  const { unread } = useNotif();
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleNavigation = (route: string) => {
    if (location.pathname !== route) {
      navigate(route);
    };
  }

  const PopupItem = ({ title, onClick }: PopupItemProps) => (
    <div
      className="border-b border-b-surface-secondary hover:border-b-surface-tertiary hover:-translate-y-0.5 px-2 transition duration-300 cursor-pointer"
      onClick={onClick}
    >
      {title}
    </div>
  );

  const popupItems = [
    { title: "View Profile", onClick: () => console.log("This should navigate to user's public profile") },
    { title: "Friends", onClick: () => handleNavigation("/friends") },
    { title: "Account Settings", onClick:() => handleNavigation("/account") },
    { title: "Sign Out", onClick: signOut },
  ]

  return (
    <nav className="bg-surface-primary w-full h-16 flex justify-between sticky top-0 px-6 z-50">
      <div className="flex items-center">
        <AiFillHome cursor="pointer" size={40} onClick={() => handleNavigation("/dashboard")} />
      </div>
      <div className="flex items-center gap-6">
        <div
          className="relative inline-block cursor-pointer"
          onClick={() => handleNavigation("/notifications")}
        >
          <TbBellFilled size={40} />
          {unread && <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse" />}
        </div>
        <div className="relative" ref={popupRef}>
          <FaUser cursor="pointer" size={36} onClick={() => setShowPopup(true)} />
          {showPopup && (
            <div className="absolute right-0 w-40 mt-1 px-3 py-3 bg-surface-secondary rounded-xl shadow-xl flex flex-col gap-2 text-left">
              {popupItems.map(({ title, onClick }) => (
                <PopupItem
                  key={title}
                  title={title}
                  onClick={() => {
                    onClick();
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