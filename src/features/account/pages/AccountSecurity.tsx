import { useAuth } from "@providers/AuthProvider";
import ChangePassword from "../components/ChangePassword";
import DeleteAccount from "../components/DeleteAccount";

const AccountSecurity = () => {
  const { user } = useAuth();

  return (
    <>
      <ChangePassword user={user} />
      <DeleteAccount user={user} />
    </>
  );
};

export default AccountSecurity;