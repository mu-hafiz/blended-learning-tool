import { useAuth } from "@providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button, RHFTextInput } from "@components";
import { Link } from "react-router-dom";
import { toast } from "@lib/toast";
import { useForm } from "react-hook-form";
import { loginSchema, type LoginValues } from "../types/formSchemas";
import { zodResolver } from "@hookform/resolvers/zod";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleLogin = async (data: LoginValues) => {
    const { email, password } = data;
    const toastId = toast.loading("Logging in...");

    try {
      const { success, error } = await login({ email, password });
      if (success) {
        toast.success("Log in successful!", {
          id: toastId
        });
        navigate('/dashboard');
      } else {
        const message = error.code === "invalid_credentials"
          ? "The provided login details are incorrect"
          : "An error occured"
        toast.error(message, {
          id: toastId
        });
        console.error('An error occured', error);
      }
    } catch (err) {
      console.error('An error occured: ', err);
      toast.error("An error occured", {
        id: toastId
      });
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-surface-primary rounded-2xl w-130 p-6 py-10">
        <form onSubmit={handleSubmit(handleLogin)}>
          <h2 className="text-center pb-4">Log In</h2>
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
            <h3 className="my-3 text-left">
              Don't have an account? <Link to="/signup" className="link">Sign up!</Link>
            </h3>
            <Button
              type="submit"
              loading={isSubmitting}
              loadingMessage="Signing in..."
            >
              Log In
            </Button>
          </div>
        </form>
      </div>
    </div>
    
  )
}

export default Login;