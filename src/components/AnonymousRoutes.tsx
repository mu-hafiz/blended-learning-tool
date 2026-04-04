import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import BreakpointLayout from "./BreakpointLayout";

const AnonymousRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) return null;

  return !user ? (
    <BreakpointLayout protectedRoutes={false}>
      <Outlet/>
    </BreakpointLayout>
  ): <Navigate to="/dashboard"/>;
}

export default AnonymousRoutes;