import { NavLink, Outlet } from "react-router-dom";

const routeNames = ["profile", "security", "privacy", "preferences"];

const Account = () => {
  return (
    <div className="flex flex-col h-[calc(100vh-130px)]">
      <h1 className="text-left mb-4">Account</h1>
      <nav className="flex gap-2">
        {routeNames.map((route) => (
          <NavLink key={route} to={route} className={({ isActive }) => (
            isActive
            ? "bg-surface-primary rounded-t-lg p-3 font-bold cursor-default capitalize text-primary-text"
            : "bg-linear-to-b from-surface-secondary from-70% to-surface-primary rounded-t-lg p-3 capitalize text-primary-text hover:bg-surface-secondary-hover"
          )}>
            {route}
          </NavLink>
        ))}
      </nav>
      <div className="bg-surface-primary rounded-2xl rounded-tl-none flex flex-1 flex-col gap-3 text-left px-3 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  )
}

export default Account;