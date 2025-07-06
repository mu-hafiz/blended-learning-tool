import Button from "@components/Button";
import { useAuth } from "@providers/AuthProvider";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    navigate('/');
    await signOut();
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
    </div>
  )
}

export default Dashboard;