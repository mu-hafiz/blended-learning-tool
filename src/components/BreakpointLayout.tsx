import { Outlet } from "react-router-dom";
import { Navbar } from "@components";

const BreakpointLayout = () => (
  <div className="min-h-dvh">
    <Navbar/>
    <div className="container">
      <Outlet/>
    </div>
  </div>
);

export default BreakpointLayout;