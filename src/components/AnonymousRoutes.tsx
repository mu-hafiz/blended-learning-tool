import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import { useLoading } from "@providers/LoadingProvider";
import { useEffect } from "react";

const AnonymousRoutes = () => {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  useEffect(() => {
    if (user === undefined) {
      showLoading("Loading your information...");
    } else {
      hideLoading();
    }

    return () => hideLoading();
  }, [user]);

  if (user === undefined) {
    return null;
  }

  return !user ? <Outlet/> : <Navigate to="/dashboard"/>;
}

export default AnonymousRoutes;