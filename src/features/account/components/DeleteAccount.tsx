import { Button, TextInput } from "@components";
import { supabase } from "@lib/supabaseClient";
import { toast } from "@lib/toast";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { useAuth } from "@providers/AuthProvider";
import usersDB from "@lib/db/users";

const DeleteAccount = ({ user }: { user: User | null | undefined }) => {
  const { login, signOut } = useAuth();

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
    if (!user) return;
    if (!confirmationStage) {
      setConfirmationStage(true);
      return;
    }

    setDeletingAccount(true);
    const toastId = toast.loading("Deleting account...");

    try {
      const loginResult = await login({
        email: user?.email!,
        password: confirmDeletePassword
      });
      if (!loginResult.success) {
        console.log("Error checking user's old password: ", loginResult.error);
        toast.error(loginResult.error.code === "invalid_credentials"
          ? "Your password seems to be incorrect."
          : "There was an error, please try again later.", {
          id: toastId
        });
        return;
      }
    
      const success = await usersDB.deleteUser(user.id);
      if (!success) {
        toast.error("Could not delete your account, please try again later", {
          id: toastId
        });
        return;
      }

      await signOut();
    } finally {
      setDeletingAccount(false);
    }
  };

  return (
    <section>
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

export default DeleteAccount;