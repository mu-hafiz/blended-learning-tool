import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";

const AnonymousRoutes = () => {
  const { session } = useAuth();
  console.log(session);

  if (session === undefined) {
    return <p className="flex">Loading...</p>
  }

  return !session ? <Outlet/> : <Navigate to="/dashboard"/>;
}

export default AnonymousRoutes;