import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import SignUp from "@pages/SignUp";
import ProtectedRoutes from "@components/ProtectedRoutes";
import Dashboard from "@pages/Dashboard";
import Login from "@pages/Login";
import NotFound from "@pages/NotFound";
import AnonymousRoutes from "@components/AnonymousRoutes";

export const router = createBrowserRouter([
  { path: "/", element: <App />, errorElement: <NotFound /> },
  { element: <AnonymousRoutes />, children: [
    { path: "/signup", element: <SignUp /> },
    { path: "/login", element: <Login /> },
  ]},
  { element: <ProtectedRoutes />, children: [
    { path: "/dashboard", element: <Dashboard /> }
  ]}
]);