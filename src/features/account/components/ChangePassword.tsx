import { Button, PasswordValidator, RHFTextInput } from "@components";
import { validatePassword } from "@utils/validatePassword";
import { TiArrowLeftThick, TiArrowRightThick, TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { supabase } from "@lib/supabaseClient";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { securitySchema, type SecurityValues } from "../types/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "@providers/AuthProvider";

const ChangePassword = ({ user }: { user: User | null | undefined }) => {
  const { login } = useAuth();

  const { control, handleSubmit, watch, formState: { isSubmitting }, reset } = useForm<SecurityValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
      oldPassword: "",
    }
  });

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

  return (
    <section className="m-2 mt-4">
      <form onSubmit={handleSubmit(handlePasswordChange)}>
        <h2>Change Password</h2>
        <p className="text-secondary-text">To change your password, enter your old and new password</p>
        <hr className="border-surface-secondary my-3"/>
        <RHFTextInput
          name="oldPassword"
          control={control}
          type="password"
          title="Old Password"
          placeholder="**********"
        />
        <div className="flex flex-row justify-between items-center gap-6 my-3">
          <RHFTextInput
            name="newPassword"
            control={control}
            type="password"
            title="New Password"
            placeholder="**********"
          />
          <TiArrowLeftThick size={35}/>
          <div className="flex flex-col items-center">
            <h3>Matching?</h3>
            { passwordsMatch
              ? <TiTickOutline size={40} className="text-success" />
              : <TiTimesOutline size={40} className="text-error"/> }
          </div>
          <TiArrowRightThick size={35}/>
          <RHFTextInput
            name="confirmPassword"
            control={control}
            type="password"
            title="Confirm Password"
            placeholder="**********"
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