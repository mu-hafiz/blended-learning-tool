import { useState } from "react";
import { Button, TextInput } from "@components";

const AccountSecurity = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const readyToSubmit = newPassword && oldPassword && newPassword === confirmPassword;

  return (
    <form className="m-2 mt-4" onSubmit={() => console.log("")}>
      <h2>Change Password</h2>
      <p className="text-secondary-text">To change your password, enter your new and old password</p>
      <hr className="border-surface-secondary my-3"/>
      <div className="flex flex-row justify-between gap-6 my-3">
        <TextInput
          type="password"
          title="New Password"
          placeholder="**********"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TextInput
          type="password"
          title="Confirm Password"
          placeholder="**********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <TextInput
        type="password"
        title="Old Password"
        placeholder="**********"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <div className="flex flex-row justify-center mt-5">
        <Button
          type="submit"
          loading={passwordUpdating}
          loadingMessage="Updating..."
          disabled={!readyToSubmit}
        >
          Update profile
        </Button>
      </div>
    </form>
  );
};

export default AccountSecurity;