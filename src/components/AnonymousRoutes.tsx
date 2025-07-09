import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";

const AnonymousRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <p className="flex">Loading...</p>
  }

  return !user ? <Outlet/> : <Navigate to="/dashboard"/>;
}

export default AnonymousRoutes;