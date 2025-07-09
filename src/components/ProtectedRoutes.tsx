import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <p className="flex">Loading...</p>
  }

  return user ? <Outlet/> : <Navigate to="/login"/>;
}

export default ProtectedRoutes;