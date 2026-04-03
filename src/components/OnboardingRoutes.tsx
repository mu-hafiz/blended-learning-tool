import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@providers/AuthProvider";
import BreakpointLayout from "./BreakpointLayout";

const OnboardingRoutes = () => {
  const { user } = useAuth();

  if (user === undefined) {
    return <p className="flex">Loading...</p>
  }

  if (!user) {
    return <Navigate to="/account/login" replace/>;
  }

  if (user.app_metadata?.onboardingCompleted) {
    return <Navigate to="/dashboard" replace/>
  }

  return (
    <BreakpointLayout protectedRoutes={false}>
      <Outlet/>
    </BreakpointLayout>
  )
}

export default OnboardingRoutes;