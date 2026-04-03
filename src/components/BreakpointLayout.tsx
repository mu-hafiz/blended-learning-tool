import { Navbar } from "@components";

type BreakpointLayoutProps = {
  children: React.ReactNode;
  protectedRoutes: boolean;
};

const BreakpointLayout = ({ children, protectedRoutes }: BreakpointLayoutProps) => {
  if (protectedRoutes) return (
    <div className="min-h-dvh">
      <Navbar/>
      <div className="container 2xl:max-w-screen-xl">
        {children}
      </div>
    </div>
  )
  
  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="container 2xl:max-w-screen-xl">
        <div className="flex items-center justify-center">
          {children}
        </div>
      </div>
    </div>
  )
};

export default BreakpointLayout;