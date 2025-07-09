import Button from "@components/Button";
import { useAuth } from "@providers/AuthProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { TbBellFilled } from "react-icons/tb";
import { useNotif } from "@providers/NotifProvider";

const Dashboard = () => {
  const { signOut } = useAuth();
  const { unread } = useNotif();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    const toastId = toast.loading("Logging out..."); 
    navigate('/');
    await signOut();
    toast.info("You have been logged out.", {
      id: toastId
    });
    setLoading(false);
  }

  return (
    <div>
      <p>Dashboard</p>
      <Button
        onClick={handleSignOut}
        loading={loading}
        loadingMessage="Signing out..."
      >
        Sign Out
      </Button>
      <div className="relative inline-block">
        <TbBellFilled
          size={40}
        />
        {unread && <div className="absolute bottom-0 right-0 w-4 h-4 bg-red-500 rounded-full animate-pulse" />}
      </div>
    </div>
  )
}

export default Dashboard;