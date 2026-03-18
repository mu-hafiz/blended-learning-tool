import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import { LoadingOverlay } from "./LoadingOverlay";

const AnonymousRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <LoadingOverlay />
  }

  return !user ? <Outlet/> : <Navigate to="/dashboard"/>;
}

export default AnonymousRoutes;