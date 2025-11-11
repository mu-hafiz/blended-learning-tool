import { PageContainer, Tabs } from "@components"
import { Outlet } from "react-router-dom";

const routes = ["level", "achievements", "statistics"];

const Progression = () => {
  return (
    <PageContainer title="Progression">
      <Tabs routes={routes} />
      <div className="basic-container rounded-tl-none">
        <Outlet />
      </div>
    </PageContainer>
  );
};

export default Progression;