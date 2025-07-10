import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App";
import SignUp from "@pages/SignUp";
import ProtectedRoutes from "@components/ProtectedRoutes";
import Dashboard from "@pages/Dashboard";
import Login from "@pages/Login";
import NotFound from "@pages/NotFound";
import AnonymousRoutes from "@components/AnonymousRoutes";
import Notifications from "@pages/Notifications";
import Account from "@pages/account/Account";
import AccountProfile from "@pages/account/AccountProfile";
import AccountSecurity from "@pages/account/AccountSecurity";
import AccountPrivacy from "@pages/account/AccountPrivacy";
import AccountPreferences from "@pages/account/AccountPreferences";
import Friends from "@pages/Friends";

export const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <NotFound /> },
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