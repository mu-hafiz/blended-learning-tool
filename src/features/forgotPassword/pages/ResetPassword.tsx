import { Button, PasswordValidator, RHFTextInput } from "@components";
import { toast } from "@lib/toast";
import { validatePassword } from "@utils/validatePassword";
import { resetPasswordSchema, type ResetPasswordValues } from "../types/formSchemas";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm<ResetPasswordValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    }
  });

  const password = watch("password");
  const passwordChecks = validatePassword(password);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/account/login", { replace: true });
        return;
      }
    }

    checkSession();
  }, [navigate]);

  const handleReset = async (data: ResetPasswordValues) => {
    const { password } = data;
    const toastId = toast.loading("Updating password...");

    const { error } = await supabase.auth.updateUser({
      password: password
    });

    if (error) {
      if (error.status === 422) {
        toast.error("Your new password can't be the same as your old password", {
          id: toastId
        });
      } else {
        toast.error("Could not update password, please try again later", {
          id: toastId
        });
      }
      console.log("Error updating password: ", error);
      return;
    }

    await supabase.auth.signOut();
    toast.success("Password changed! Please login again.", {
      id: toastId
    });
    navigate("/account/login");
  }

  return (
    <div className="min-h-dvh flex items-center justify-center">
      <div className="container 2xl:max-w-screen-xl">
        <div className="flex items-center justify-center">
          <div className="bg-surface-primary rounded-2xl w-full sm:w-130 p-6 pb-10">
            <form onSubmit={handleSubmit(handleReset)}>
              <h1 className="text-center pb-4">Reset Password</h1>
              <div className="flex flex-col gap-2">
                <RHFTextInput
                  name="password"
                  control={control}
                  type="password"
                  placeholder="**********"
                  title="Password"
                />
                <div className="text-left mb-3">
                  {passwordChecks.map(({ check, message }, idx) => (
                    <PasswordValidator key={idx} boolValue={check} message={message} />
                  ))}
                </div>
                <RHFTextInput
                  name="confirmPassword"
                  control={control}
                  type="password"
                  placeholder="**********"
                  title="Confirm Password"
                  containerClassName="mb-4"
                />
                <Button
                  type="submit"
                  loading={isSubmitting}
                  loadingMessage="Creating account..."
                >
                  Change password
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResetPassword;