import { Button, PasswordValidator, RHFTextInput, TextInput } from "@components";
import { validatePassword } from "@utils/validatePassword";
import { TiArrowLeftThick, TiArrowRightThick, TiTickOutline, TiTimesOutline } from "react-icons/ti";
import { supabase } from "@lib/supabaseClient";
import { toast } from "sonner";
import { useAuth } from "@providers/AuthProvider";
import { useForm } from "react-hook-form";
import { securitySchema, type SecurityValues } from "@models/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";

const DeleteAccount = ({ user }: { user: User | null | undefined }) => {
  const [confirmDeletePassword, setConfirmDeletePassword] = useState("");
  const [confirmationStage, setConfirmationStage] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);
  const deleteRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (deleteRef.current && !deleteRef.current.contains(event.target as Node)) {
        setConfirmationStage(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDeleteAccount = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!confirmationStage) {
      setConfirmationStage(true);
      return;
    }

    setDeletingAccount(true);
    const toastId = toast.loading("Deleting account...");

    try {
      const loginResult = await supabase.auth.signInWithPassword({
        email: user?.email!,
        password: confirmDeletePassword
      });
      if (loginResult.error) {
        console.log("Error checking user's old password: ", loginResult.error);
        toast.error(loginResult.error.code === "invalid_credentials"
          ? "Your password seems to be incorrect."
          : "There was an error, please try again later.", {
          id: toastId
        });
        return;
      }
    
      const deleteResult = await supabase.from("profiles")
        .update({ deleted: true })
        .eq('user_id', user!.id);
      if (deleteResult.error) {
        console.log("Error deleting account: ", deleteResult.error);
        toast.error("Could not delete your account, please try again later", {
          id: toastId
        });
        return;
      }

      await supabase.auth.signOut();
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <section className="m-2 my-4">
      <form onSubmit={handleDeleteAccount}>
        <h2>DANGER ZONE (Delete Account)</h2>
        <p className="text-secondary-text">This will wipe your achievements, stats, and other data</p>
        <hr className="border-surface-secondary my-3"/>
        <TextInput
          type="password"
          title="Password"
          description="Enter your current password to proceed"
          value={confirmDeletePassword}
          onChange={(e) => setConfirmDeletePassword(e.target.value)}
        />
        <div className="flex flex-row justify-center mt-3">
          <Button
            type="submit"
            variant="danger"
            loading={deletingAccount}
            loadingMessage="Deleting account..."
            ref={deleteRef}
          >
            {confirmationStage ? "CONFIRM DELETE" : "Delete Account"}
          </Button>
        </div>
      </form>
    </section>
  );
}

const AccountSecurity = () => {
  const { user } = useAuth();

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
    <>
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

      <DeleteAccount user={user} />
    </>
  );
};

export default AccountSecurity;