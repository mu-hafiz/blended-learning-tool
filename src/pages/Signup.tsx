import { useAuth } from "@providers/AuthProvider";
import { Link, useNavigate } from "react-router-dom";
import { Button, PasswordValidator, RHFTextInput } from "@components";
import { toast } from "sonner";
import { validatePassword } from "@utils/validatePassword";
import { signUpSchema, type SignUpValues } from "@models/formSchemas";
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod";

const SignUp = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const { control, handleSubmit, watch, formState: { isSubmitting } } = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const password = watch("password");
  const passwordChecks = validatePassword(password);

  const handleSignUp = async (data: SignUpValues) => {
    const { email, password } = data;
    const toastId = toast.loading("Creating account...");

    try {
      const { success, error } = await signUp({ email, password });
      if (success) {
        toast.success("Account created!", {
          id: toastId
        });
        navigate('/dashboard');
      } else {
        if (error.code === "user_already_exists") {
          toast.error("An account with that email already exists", {
            id: toastId,
            action: {
              label: "Login",
              onClick: () => navigate('/login')
            }
          });
        } else {
          toast.error("An error occured", {
            id: toastId
          });
        }
        console.error('An error occured');
      }
    } catch (err) {
      console.error('An error occured: ', err);
      toast.error("An error occured", {
        id: toastId
      });
    }
  }

  return (
    <div>
      <form className="max-w-md m-auto pt-24" onSubmit={handleSubmit(handleSignUp)}>
        <h2 className="pb-4">Sign Up</h2>
        <div className="flex flex-col gap-2">
          <RHFTextInput
            name="email"
            control={control}
            type="email"
            placeholder="example@student.manchester.ac.uk"
            title="University Email"
          />
          <RHFTextInput
            name="password"
            control={control}
            type="password"
            placeholder="**********"
            title="Password"
          />
          <div className="text-left">
            {passwordChecks.map(({ check, message }, idx) => (
              <PasswordValidator key={idx} boolValue={check} message={message} />
            ))}
            <h3 className="my-3">
              Already have an account? <Link to="/login">Login!</Link>
            </h3>
          </div>
          <Button
            type="submit"
            loading={isSubmitting}
            loadingMessage="Creating account..."
          >
            Create Account
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignUp;