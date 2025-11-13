import { Toaster } from "sonner";
import { LoadingOverlay } from "./LoadingOverlay";
import { NotifProvider } from "@providers/NotifProvider";
import { Outlet } from "react-router-dom";

const RootLayout = () => (
  <NotifProvider>
    <Outlet />
    <LoadingOverlay />
    <Toaster richColors position='top-center' />
  </NotifProvider>
);

export default RootLayout;