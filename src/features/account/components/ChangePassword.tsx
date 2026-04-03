import { Button, PasswordValidator, RHFTextInput } from "@components";
import { validatePassword } from "@utils/validatePassword";
import { TiArrowLeftThick, TiArrowRightThick, TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { supabase } from "@lib/supabaseClient";
import { toast } from "@lib/toast";
import { type SecurityValues } from "../types/formSchemas";
import { useAuth } from "@providers/AuthProvider";
import { useOutletContext } from "react-router-dom";
import { type AccountOutletContext } from "../types/stateTypes";

const ChangePassword = () => {
  const { user, login } = useAuth();

  const { securityForm } = useOutletContext<AccountOutletContext>();
  const { control, handleSubmit, watch, formState: { isSubmitting }, reset } = securityForm;

  const newPassword = watch("newPassword");
  const confirmPassword = watch("confirmPassword");
  const passwordChecks = validatePassword(newPassword);
  const passwordsMatch = newPassword && newPassword === confirmPassword;

  const handlePasswordChange = async (data: SecurityValues) => {
    const { oldPassword, newPassword } = data;
    const toastId = toast.loading("Updating password...");

    const loginResult = await login({
      email: user?.email!,
      password: oldPassword
    });
    if (!loginResult.success) {
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
      toast.error("There was an error updating your password, please try again later.", {
        id: toastId
      });
    } else {
      toast.success("Password updated!", {
        id: toastId
      });
      reset();
    }
  };

  const MatchingStatus = ({ desktop = false }) => (
    <div className={`flex items-center ${desktop ? 'flex-row justify-between hidden md:flex' : 'flex flex-row md:hidden justify-center gap-2 mb-2'}`}>
      {desktop && <TiArrowLeftThick size={35}/>}
      <div className="flex flex-row md:flex-col items-center gap-1">
        {desktop && <h3>Passwords Match?</h3>}
        {passwordsMatch 
          ? <TiTickOutline className="text-success size-7 sm:size-8" /> 
          : <TiTimesOutline className="text-error size-7 sm:size-8"/>}
        {!desktop && <h3>Passwords Match?</h3>}
      </div>
      {desktop && <TiArrowRightThick size={35}/>}
    </div>
  );

  return (
    <section>
      <form onSubmit={handleSubmit(handlePasswordChange)}>
        <h2>Change Password</h2>
        <p className="subtitle">To change your password, enter your old and new password</p>
        <hr className="divider"/>
        <RHFTextInput
          name="oldPassword"
          control={control}
          type="password"
          title="Old Password"
          placeholder="**********"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-3 md:gap-6 my-3">
          <RHFTextInput
            name="newPassword"
            control={control}
            type="password"
            title="New Password"
            placeholder="**********"
            containerClassName="flex-1"
          />
          <MatchingStatus desktop />
          <RHFTextInput
            name="confirmPassword"
            control={control}
            type="password"
            title="Confirm Password"
            placeholder="**********"
            containerClassName="flex-1"
          />
        </div>
        <div className="flex flex-col bg-surface-secondary rounded-2xl w-fit mx-auto p-4">
          <MatchingStatus />
          {passwordChecks.map(({check, message}, idx) => (
            <PasswordValidator key={idx} boolValue={check} message={message} />
          ))}
        </div>
        <div className="flex flex-row justify-center mt-5">
          <Button
            type="submit"
            loading={isSubmitting}
            loadingMessage="Updating..."
          >
            Update profile
          </Button>
        </div>
      </form>
    </section>
  );
}

export default ChangePassword;