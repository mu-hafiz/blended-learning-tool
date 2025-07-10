import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import Navbar from "@components/Navbar";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <p className="flex">Loading...</p>
  }

  return user ? (
    <>
      <Navbar/>
      <div className="pt-16">
        <Outlet/>
      </div>
    </>
  ) : <Navigate to="/login"/>;
}

export default ProtectedRoutes;