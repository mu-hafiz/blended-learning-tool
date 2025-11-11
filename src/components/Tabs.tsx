import { NavLink } from "react-router-dom";

const Tabs = ({ routes }: { routes: string[] }) => (
  <nav className="flex gap-2">
    {routes.map((route) => (
      <NavLink key={route} to={route} className={({ isActive }) => (
        isActive
        ? "bg-surface-primary rounded-t-lg p-2 px-3 cursor-default"
        : "bg-linear-to-b from-surface-secondary from-70% to-surface-primary rounded-t-lg p-2 hover:bg-surface-secondary-hover"
      )}>
        <h3 className="capitalize">{route}</h3>
      </NavLink>
    ))}
  </nav>
);

export default Tabs;