import { Outlet } from "react-router-dom";
import { PageContainer, Tabs } from "@components";

const routeNames = ["profile", "security", "privacy", "preferences"];

const Account = () => {
  return (
    <PageContainer title="Account">
      <Tabs routes={routeNames}/>
      <div className="basic-container rounded-tl-none">
        <Outlet/>
      </div>
    </PageContainer>
  )
}

export default Account;