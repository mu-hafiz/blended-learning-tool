import { useState } from "react";
import { Button, TextInput, PasswordValidator } from "@components";
import { validatePassword } from "@utils/validatePassword";
import { TiArrowLeftThick, TiArrowRightThick, TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { supabase } from "@lib/supabaseClient";
import { toast } from "sonner";
import { useAuth } from "@providers/AuthProvider";

const AccountSecurity = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [passwordUpdating, setPasswordUpdating] = useState(false);

  const { user } = useAuth();
  const { passwordChecks, allChecksPassed } = validatePassword(newPassword);

  const passwordsMatch = newPassword && oldPassword && newPassword === confirmPassword;
  const readyToSubmit = passwordsMatch && allChecksPassed;

  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPasswordUpdating(true);
    const toastId = toast.loading("Updating password...");

    try {
      const loginResult = await supabase.auth.signInWithPassword({
        email: user?.email!,
        password: oldPassword
      });
      if (loginResult.error) {
        console.log("Error checking user's old password: ", loginResult.error);
        toast.error(loginResult.error.code === "invalid_credentials"
          ? "Your old password seems to be incorrect."
          : "There was an error, please try again later.", {
          id: toastId
        });
        return;
      }

      const updateResult = await supabase.auth.updateUser({ password: newPassword });
      if (updateResult.error) {
        console.log("Error updating user's password: ", updateResult.error);
        toast.error(updateResult.error.code === "same_password"
          ? "Your new and old passwords cannot match."
          : "There was an error updating your password, please try again later.", {
          id: toastId
        });
      } else {
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        toast.success("Password updated!", {
          id: toastId
        });
      }
    } finally {
      setPasswordUpdating(false);
    }
  };

  return (
    <form className="m-2 mt-4" onSubmit={handlePasswordChange}>
      <h2>Change Password</h2>
      <p className="text-secondary-text">To change your password, enter your old and new password</p>
      <hr className="border-surface-secondary my-3"/>
      <TextInput
        type="password"
        title="Old Password"
        placeholder="**********"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
      />
      <div className="flex flex-row justify-between items-center gap-6 my-3">
        <TextInput
          type="password"
          title="New Password"
          placeholder="**********"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
        <TiArrowLeftThick size={35}/>
        <div className="flex flex-col items-center">
          <h3>Matching?</h3>
          { passwordsMatch
            ? <TiTickOutline size={40} className="text-success" />
            : <TiTimesOutline size={40} className="text-error"/> }
        </div>
        <TiArrowRightThick size={35}/>
        <TextInput
          type="password"
          title="Confirm Password"
          placeholder="**********"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      <div className="flex flex-col bg-surface-secondary rounded-2xl w-fit mx-auto p-4">
        {passwordChecks.map(({check, message}, idx) => (
          <PasswordValidator key={idx} boolValue={check} message={message} />
        ))}
      </div>
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