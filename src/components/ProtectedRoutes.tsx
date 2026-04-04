import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import { BreakpointLayout } from "@components";
import { toast } from "@lib/toast";

const ProtectedRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) return null;

  if (!user) {
    return <Navigate to="/account/login" replace/>;
  }

  if (!user.app_metadata?.onboardingCompleted) {
    return <Navigate to="/account/onboarding" replace/>;
  }

  return (
    <BreakpointLayout protectedRoutes={true}>
      <Outlet/>
    </BreakpointLayout>
  );
}

export default ProtectedRoutes;