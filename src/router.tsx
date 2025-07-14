import { createBrowserRouter, Navigate } from "react-router-dom";
import Homepage from "@pages/Homepage";
import SignUp from "@features/signUp/pages/SignUp";
import { ProtectedRoutes, AnonymousRoutes } from "@components";
import Dashboard from "@pages/Dashboard";
import Login from "@features/login/pages/Login";
import NotFound from "@pages/NotFound";
import Notifications from "@features/notifications/pages/Notifications";
import Account from "@features/account/pages/Account";
import AccountProfile from "@features/account/pages/AccountProfile";
import AccountSecurity from "@features/account/pages/AccountSecurity";
import AccountPrivacy from "@features/account/pages/AccountPrivacy";
import AccountPreferences from "@features/account/pages/AccountPreferences";
import Friends from "@pages/Friends";

export const router = createBrowserRouter([
  { path: "/", element: <Homepage />, errorElement: <NotFound /> },
  { element: <AnonymousRoutes />, children: [
    { path: "/signup", element: <SignUp /> },
    { path: "/login", element: <Login /> },
  ]},
  { element: <ProtectedRoutes />, children: [
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/notifications", element: <Notifications />},
    { path: "/friends", element: <Friends />},
    { path: "/account", element: <Account />, children: [
      { index: true, element: <Navigate to="profile" replace />},
      { path: "profile", element: <AccountProfile /> },
      { path: "security", element: <AccountSecurity /> },
      { path: "privacy", element: <AccountPrivacy />},
      { path: "preferences", element: <AccountPreferences />}
    ]}
  ]}
]);